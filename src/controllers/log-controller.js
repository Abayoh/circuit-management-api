const LogSchema = require('../models/Log');
const common = require('./common');

//@desc Create a new Log  in mongodb
//@route POST /cmg/v0/Log
//@access Private
exports.createLog = async (req, res) => {
  const data = req.body;
  common.create(data, res, LogSchema);
};

//@desc Get all Log  data from mongodb
//@route GET /cmg/v0/Log-billing-data
//@access Private
exports.getLogs = async (req, res) => {
  common.readAll(res, LogSchema);
};
