const ChequeSchema = require('../models/cheque');
const common = require('./common');

//@desc Create a new Cheque  in mongodb
//@route POST /cmg/v0/Cheque
//@access Private
exports.createCheque = async (req, res) => {
  const data = req.body;
  common.create(data, res, ChequeSchema);
};

//@desc Get all Cheque  data from mongodb
//@route GET /cmg/v0/Cheque-billing-data
//@access Private
exports.getCheques = async (req, res) => {
  common.readAll(res, ChequeSchema);
};

//@desc Update a Cheque in mongodb
//@route PUT /cmg/v0/:id
//@access Private
exports.updateCheque = async (req, res, next) => {
  common.updateOne(req, res, ChequeSchema);
};

//@desc Delete Document from mongodb
//@route DELETE /cmg/v0/:id
//@access Private
// exports.deleteChequeBillingData = async (req, res, next) => {
//   await deleteRecordById(req, res, ChequeBillingSchema);
// };
