const PaymentSchema = require('../models/payment');
const common = require('./common');

//@desc Create a new Payment  in mongodb
//@route POST /cmg/v0/Payment
//@access Private
exports.createPayments = async (req, res) => {
  const arr = req.body;
  common.createMany(arr, res, PaymentSchema);
};

//@desc Get all Payment  data from mongodb
//@route GET /cmg/v0/Payment-billing-data
//@access Private
exports.getPayments = async (req, res) => {
  common.readAll(res, PaymentSchema);
};



