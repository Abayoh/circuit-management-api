const Cheque = require('../models/cheque');
const common = require('./common');
const { chequeSchema } = require('../models/joi-schema');
const createError = require('http-errors');

//@desc Create a new Cheque  in mongodb
//@route POST /cmg/v0/Cheque
//@access Private
exports.createCheque = async (req, res, next) => {
  try {
    const result = await chequeSchema.validateAsync(req.body);
    common.create(result, res, Cheque, next);
  } catch (err) {
    next(err);
  }
};

//@desc Get all Cheque  data from mongodb
//@route GET /cmg/v0/Cheque-billing-data
//@access Private
exports.getCheques = async (req, res, next) => {
  common.readAll(res, Cheque, next);
};

//@desc Update a Cheque in mongodb
//@route PUT /cmg/v0/:id
//@access Private
exports.updateCheque = async (req, res, next) => {
  try {
    const result = await chequeSchema.validateAsync(req.body);
    const {id} = req.params
    const temp = {id, data:result}
    common.updateOne(temp, res, Cheque, next);
  } catch (err) {
    next(err);
  }
};

//@desc Delete Document from mongodb
//@route DELETE /cmg/v0/:id
//@access Private
// exports.deleteChequeBillingData = async (req, res, next) => {
//   await deleteRecordById(req, res, ChequeBillingSchema);
// };
