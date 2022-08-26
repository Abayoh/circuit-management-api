const ChequeSchema = require('../models/cheque');
const common = require('./common');
const createError = require('http-errors');

//@desc Create a new Cheque  in mongodb
//@route POST /cmg/v0/Cheque
//@access Private
exports.createCheque = async (req, res, next) => {
  try {
    const data = req.body;
    common.create(data, res, ChequeSchema, next);
  } catch (err) {
    next(err)
  }
};

//@desc Get all Cheque  data from mongodb
//@route GET /cmg/v0/Cheque-billing-data
//@access Private
exports.getCheques = async (req, res, next) => {
  common.readAll(res, ChequeSchema, next);
};

//@desc Update a Cheque in mongodb
//@route PUT /cmg/v0/:id
//@access Private
exports.updateCheque = async (req, res, next) => {
  common.updateOne(req, res, ChequeSchema, next);
};

//@desc Delete Document from mongodb
//@route DELETE /cmg/v0/:id
//@access Private
// exports.deleteChequeBillingData = async (req, res, next) => {
//   await deleteRecordById(req, res, ChequeBillingSchema);
// };
