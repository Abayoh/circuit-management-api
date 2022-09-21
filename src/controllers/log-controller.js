const Log = require('../models/log');
const common = require('./common');
const { logSchema } = require('../models/joi-schema');

//@desc Create a new Log  in mongodb
//@route POST /cmg/v0/Log
//@access Private
exports.createLog = async (req, res, next) => {
  try {
    const result = await customerSchema.validateAsync(req.body);

    common.create(result, res, Log, next);
  } catch (err) {
    next(err);
  }
};

//@desc Get all Log  data from mongodb
//@route GET /cmg/v0/Log-billing-data
//@access Private
exports.getLogs = async (req, res) => {
  common.readAll(res, Log);
};
