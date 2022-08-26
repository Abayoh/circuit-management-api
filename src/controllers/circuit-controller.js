const Circuit = require('../models/circuit');
const common = require('./common');
const { circuitSchema } = require('../models/joi-schema');
//@desc Create a new Circuit  in mongodb
//@route POST /cmg/v0/Circuit
//@access Private
exports.createCircuit = async (req, res, next) => {
  try {
    const result = await circuitSchema.validateAsync(req.body);
    common.create(result, res, Circuit, next, 'name');
  } catch (err) {
    next(err);
  }
};

//@desc Get all Circuit  data from mongodb
//@route GET /cmg/v0/Circuit-billing-data
//@access Private
exports.getCircuits = async (req, res, next) => {
  common.readAll(res, Circuit, next);
};

//@desc Update a Circuit in mongodb
//@route PUT /cmg/v0/:id
//@access Private
exports.updateCircuit = async (req, res, next) => {
  try {
    const result = await circuitSchema.validateAsync(req.body);
    const { id } = req.params;
    const temp = { id, data: result };
    common.updateOne(temp, res, Circuit, next);
  } catch (err) {
    next(err);
  }
};

//@desc Delete Document from mongodb
//@route DELETE /cmg/v0/:id
//@access Private
// exports.deleteCircuitData = async (req, res, next) => {
//   await deleteRecordById(req, res, Circuit);
// };
