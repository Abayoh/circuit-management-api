const cController = require('../controllers/customer-controller');
const express = require('express');

const customerRouter = express.Router();

customerRouter
  .route('/')
  .get(cController.getCustomers)
  .post(cController.createCustomer);
customerRouter.route('/:id').put(cController.updateCustomer);

module.exports = customerRouter;

