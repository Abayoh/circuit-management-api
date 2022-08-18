const CustomerSchema = require('../models/customer');
const common = require('./common');

//@desc Create a new Customer  in mongodb
//@route POST /cmg/v0/customer
//@access Private
exports.createCustomer = async (req, res) => {
  const data = req.body;
  common.create(data, res, CustomerSchema, 'name');
};

//@desc Get all Customer  data from mongodb
//@route GET /cmg/v0/customer-billing-data
//@access Private
exports.getCustomers = async (req, res) => {
  common.readAll(res, CustomerSchema);
};

//@desc Update a customer in mongodb
//@route PUT /cmg/v0/:id
//@access Private
exports.updateCustomer = async (req, res, next) => {
  common.updateOne(req, res, CustomerSchema);
};

//@desc Delete Document from mongodb
//@route DELETE /cmg/v0/:id
//@access Private
// exports.deleteCustomerBillingData = async (req, res, next) => {
//   await deleteRecordById(req, res, CustomerBillingSchema);
// };
