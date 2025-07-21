import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Link } from 'react-router-dom';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '');

const StripePaymentForm = ({ orderTotal, orderId, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [orderVerified, setOrderVerified] = useState(false);
  const [cardholderName, setCardholderName] = useState('');

  React.useEffect(() => {
    const initializePayment = async () => {
      try {
        const orderResponse = await axios.get(`/api/orders/${orderId}`);
        if (!orderResponse.data || orderResponse.data.items.length === 0) {
          throw new Error('Order is invalid or has no items');
        }

        const response = await axios.post('/api/payments/create-payment-intent', {
          orderId
        });
        
        if (!response.data.clientSecret) {
          throw new Error('Failed to initialize payment');
        }

        setClientSecret(response.data.clientSecret);
        setOrderVerified(true);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Payment initialization failed');
      }
    };
    
    if (orderId) {
      initializePayment();
    }
  }, [orderId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements || !clientSecret || !orderVerified) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: cardholderName || 'Customer'
          }
        }
      });

      if (stripeError) {
        throw stripeError;
      }

      if (paymentIntent.status === 'succeeded') {
        await axios.post('/api/payments/confirm-payment', {
          orderId,
          paymentIntentId: paymentIntent.id
        });
        onSuccess();
      }
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (!stripePromise) {
    return (
      <div className="payment-error">
        Payment system is currently unavailable. Please try again later.
      </div>
    );
  }

  return (
    <div className="stripe-payment-container">
      <h3 className="payment-title">Secure Payment</h3>
      <div className="payment-card-wrapper">
        {!orderVerified ? (
          <div className="payment-loading">
            {error ? (
              <div className="payment-error-message">{error}</div>
            ) : (
              <div className="loading-spinner"></div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="payment-form">
            <div className="form-group">
              <label className="form-label">Cardholder Name</label>
              <input
                type="text"
                className="card-name-input"
                placeholder="John Smith"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Card Details</label>
              <div className="card-element-container">
                <CardElement 
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#32325d',
                        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                      invalid: {
                        color: '#fa755a',
                        iconColor: '#fa755a',
                      },
                    },
                    hidePostalCode: true,
                  }}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={!stripe || processing}
              className="payment-button"
            >
              {processing ? (
                <>
                  <span className="spinner"></span> Processing...
                </>
              ) : (
                `Pay $${orderTotal.toFixed(2)}`
              )}
            </button>

            <div className="payment-security">
              <div className="lock-icon">🔒</div>
              <span>Payments are secure and encrypted</span>
            </div>

            {error && <div className="payment-error-message">{error}</div>}
          </form>
        )}
      </div>
    </div>
  );
};

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState(null);
  const [orderTotal, setOrderTotal] = useState(0);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!user?.address) {
        throw new Error('Please set a delivery address in your profile');
      }

      const response = await axios.post('/api/orders', {
        paymentMethod: 'card',
        deliveryAddress: user.address._id || user.address
      });
      
      setOrderId(response.data._id);
      setOrderTotal(response.data.total);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    clearCart();
    navigate(`/orders/${orderId}`, { state: { paymentSuccess: true } });
  };

  if (!cart?.items?.length) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <Link to="/restaurants" className="btn-primary">Browse Restaurants</Link>
      </div>
    );
  }

  const subtotal = cart.items.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + 5.99 + tax;

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Checkout</h1>
        
        <div className="checkout-grid">
          {!orderId ? (
            <form onSubmit={handleOrderSubmit} className="checkout-form">
              <h2>Payment Method</h2>
              <p>We accept all major credit and debit cards via Stripe</p>
              
              {error && <div className="error-message">{error}</div>}
              
              <button 
                type="submit" 
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Creating Order...' : 'Proceed to Payment'}
              </button>
            </form>
          ) : (
            <div className="checkout-form">
              <h2>Complete Your Payment</h2>
              <Elements stripe={stripePromise}>
                <StripePaymentForm 
                  orderTotal={orderTotal} 
                  orderId={orderId}
                  onSuccess={handlePaymentSuccess}
                />
              </Elements>
            </div>
          )}

          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="order-items">
              {cart.items.map(item => (
                <div key={item._id} className="order-item">
                  <div className="item-info">
                    <h4>{item.menuItem.name}</h4>
                    <p>${item.menuItem.price.toFixed(2)} × {item.quantity}</p>
                  </div>
                  <div className="item-total">
                    ${(item.menuItem.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Tax (8%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Delivery Fee:</span>
                <span>$5.99</span>
              </div>
              <div className="total-row grand-total">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;