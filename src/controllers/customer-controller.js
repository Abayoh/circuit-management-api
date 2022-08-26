const Customer = require('../models/customer');
const common = require('./common');
const { customerSchema } = require('../models/joi-schema');

//@desc Create a new Customer  in mongodb
//@route POST /cmg/v0/customer
//@access Private
exports.createCustomer = async (req, res, next) => {
  try {
    const result = await customerSchema.validateAsync(req.body);

    common.create(result, res, Customer, next, 'name');
  } catch (err) {
    next(err);
  }
};

//@desc Get all Customer  data from mongodb
//@route GET /cmg/v0/customer-billing-data
//@access Private
exports.getCustomers = async (req, res, next) => {
  common.readAll(res, Customer, next);
};

//@desc Update a customer in mongodb
//@route PUT /cmg/v0/:id
//@access Private
exports.updateCustomer = async (req, res, next) => {
  
  try {
    const result = await customerSchema.validateAsync(req.body);
  const { id } = req.params;
  const temp = { id, data: result };
    common.updateOne(temp, res, Customer, next);
  } catch (err) {
    next(err);
  }
};

//@desc Delete Document from mongodb
//@route DELETE /cmg/v0/:id
//@access Private
// exports.deleteCustomerBillingData = async (req, res, next) => {
//   await deleteRecordById(req, res, CustomerBillingSchema);
// };
