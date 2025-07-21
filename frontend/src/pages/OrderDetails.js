import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaClock, FaCheckCircle, FaTimesCircle, FaMotorcycle } from 'react-icons/fa';

const OrderDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/${id}`);
        setOrder(res.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.msg || 'Error fetching order');
        setLoading(false);
      }
    };

    if (user) {
      fetchOrder();
    }
  }, [id, user]);

  const getStatusIcon = () => {
    switch (order?.status) {
      case 'pending':
        return <FaClock className="status-icon pending" />;
      case 'confirmed':
      case 'preparing':
        return <FaClock className="status-icon preparing" />;
      case 'out-for-delivery':
        return <FaMotorcycle className="status-icon delivery" />;
      case 'delivered':
        return <FaCheckCircle className="status-icon delivered" />;
      case 'cancelled':
        return <FaTimesCircle className="status-icon cancelled" />;
      default:
        return <FaClock className="status-icon" />;
    }
  };

  const getStatusText = () => {
    switch (order?.status) {
      case 'pending':
        return 'Your order is being processed';
      case 'confirmed':
        return 'Restaurant has confirmed your order';
      case 'preparing':
        return 'Restaurant is preparing your food';
      case 'out-for-delivery':
        return 'Your order is on the way!';
      case 'delivered':
        return 'Order delivered';
      case 'cancelled':
        return 'Order cancelled';
      default:
        return 'Order status unknown';
    }
  };

  if (loading) {
    return <div className="order-loading">Loading order details...</div>;
  }

  if (error) {
    return <div className="order-error">{error}</div>;
  }

  if (!order) {
    return <div className="order-not-found">Order not found</div>;
  }

  return (
    <div className="order-details-page">
      <div className="order-header">
        <h1>Order #{order._id.slice(-6).toUpperCase()}</h1>
        <div className="order-status">
          {getStatusIcon()}
          <div>
            <h3>{getStatusText()}</h3>
            {order.estimatedDeliveryTime && (
              <p>
                Estimated delivery: {new Date(order.estimatedDeliveryTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div className="order-container">
        <div className="order-info">
          <div className="restaurant-info">
            <h2>{order.restaurant.name}</h2>
            <p>{order.restaurant.address.street}</p>
            <p>{order.restaurant.address.city}, {order.restaurant.address.state} {order.restaurant.address.zipCode}</p>
          </div>
          
          <div className="delivery-info">
            <h3>Delivery Address</h3>
            <p>{order.deliveryAddress.street}</p>
            <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}</p>
          </div>
          
          <div className="payment-info">
            <h3>Payment Method</h3>
            <p>{order.paymentMethod.replace('-', ' ')}</p>
            <p className={`payment-status ${order.paymentStatus}`}>
              Payment {order.paymentStatus}
            </p>
          </div>
        </div>
        
        <div className="order-items">
          <h2>Your Order</h2>
          {order.items.map(item => (
            <div key={item._id} className="order-item">
              <div className="item-quantity">{item.quantity} ×</div>
              <div className="item-details">
                <h3>{item.menuItem.name}</h3>
                {item.specialInstructions && (
                  <p className="special-instructions">
                    <em>Note: {item.specialInstructions}</em>
                  </p>
                )}
              </div>
              <div className="item-price">
                ${(item.priceAtOrder * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
          
          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Tax:</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Delivery Fee:</span>
              <span>${order.deliveryFee.toFixed(2)}</span>
            </div>
            <div className="total-row grand-total">
              <span>Total:</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;