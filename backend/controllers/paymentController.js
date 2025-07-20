require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');

exports.createPaymentIntent = async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY not configured');
      return res.status(500).json({ error: 'Payment service not configured' });
    }

    const { orderId } = req.body;
    
    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id
    })
    .populate('restaurant')
    .populate('items.menuItem');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    if (order.items.length === 0) {
      return res.status(400).json({ error: 'Order has no items' });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ error: 'Order already paid' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total * 100),
      currency: 'usd',
      metadata: { 
        orderId: order._id.toString(),
        userId: req.user.id,
        restaurantId: order.restaurant._id.toString()
      },
      description: `Food delivery from ${order.restaurant.name}`
    });

    order.paymentDetails = {
      paymentIntentId: paymentIntent.id,
      status: 'pending'
    };
    await order.save();

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      orderId: order._id,
      amount: order.total
    });
  } catch (err) {
    console.error('Payment error:', err);
    res.status(500).json({ 
      error: 'Payment processing failed',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const { orderId, paymentIntentId } = req.body;
    
    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id
    });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      order.paymentStatus = 'paid';
      order.status = 'processing';
      order.paymentDetails = {
        paymentId: paymentIntent.id,
        last4: paymentIntent.charges?.data[0]?.payment_method_details?.card?.last4 || 'N/A',
        cardBrand: paymentIntent.charges?.data[0]?.payment_method_details?.card?.brand || 'N/A',
        status: 'succeeded'
      };
      await order.save();

      res.json({
        success: true,
        message: 'Payment confirmed successfully',
        orderId: order._id
      });
    } else {
      order.paymentStatus = 'failed';
      order.paymentDetails.status = paymentIntent.status;
      await order.save();
      
      res.status(400).json({
        error: 'Payment not completed',
        status: paymentIntent.status
      });
    }
  } catch (err) {
    console.error('Payment confirmation error:', err);
    res.status(500).json({ 
      error: 'Payment confirmation failed',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};