const CircuitSchema = require('../models/circuit');
const common = require('./common');

//@desc Create a new Circuit  in mongodb
//@route POST /cmg/v0/Circuit
//@access Private
exports.createCircuit = async (req, res) => {
  const data = req.body;
  common.create(data, res, CircuitSchema, 'name');
};

//@desc Get all Circuit  data from mongodb
//@route GET /cmg/v0/Circuit-billing-data
//@access Private
exports.getCircuits = async (req, res) => {
  common.readAll(res, CircuitSchema);
};

//@desc Update a Circuit in mongodb
//@route PUT /cmg/v0/:id
//@access Private
exports.updateCircuit = async (req, res, next) => {
  common.updateOne(req, res, CircuitSchema);
};

//@desc Delete Document from mongodb
//@route DELETE /cmg/v0/:id
//@access Private
// exports.deleteCircuitData = async (req, res, next) => {
//   await deleteRecordById(req, res, CircuitSchema);
// };
