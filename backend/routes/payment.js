const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const paymentController = require('../controllers/paymentController');

// @route   POST /api/payments/create-payment-intent
// @desc    Create Stripe payment intent
// @access  Private
router.post('/create-payment-intent', auth, paymentController.createPaymentIntent);

// @route   POST /api/payments/confirm-payment
// @desc    Confirm payment after successful client-side processing
// @access  Private
router.post('/confirm-payment', auth, paymentController.confirmPayment);

module.exports = router;