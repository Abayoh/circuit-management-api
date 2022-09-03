const Payment = require('../models/payment');
const common = require('./common');

//@desc Create a new Payment  in mongodb
//@route POST /cmg/v0/Payment
//@access Private
exports.createPayments = async (req, res, next) => {
  try {
    const { payments, chequeInfo } = req.body;
    const file = req.file;
    const arr = JSON.parse(payments);
    common.createMany(arr, res, Payment, next);
  } catch (err) {
    next(err);
  }
};

//@desc Get all Payment  data from mongodb
//@route GET /cmg/v0/Payment-billing-data
//@access Private
exports.getPayments = async (req, res, next) => {
  common.readAll(res, Payment, next);
};
