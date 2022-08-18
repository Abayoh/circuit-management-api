const cController = require('../controllers/payment-controller');
const express = require('express');

const paymentRouter = express.Router();

paymentRouter
  .route('/')
  .get(cController.getPayments)
  .post(cController.createPayments);

module.exports = paymentRouter;
