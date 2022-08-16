const CustomerSchema = require('../models/customer');

//@desc Create a new Customer  in mongodb
//@route POST /cmg/v0/customer
//@access Private
exports.createCustomer = async (req, res) => {
  const data = req.body;
  try {
    const { name } = data;
    //check for unique objects in array of objects
    const existingData = await CustomerSchema.findOne({
      name,
    });
    if (existingData) {
      return res.status(400).json({
        msg: `This customer name already exists`,
      });
    }
    const result = await CustomerSchema.create(data);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//@desc Get all Customer  data from mongodb
//@route GET /cmg/v0/customer-billing-data
//@access Private
exports.getCustomers = async (req, res) => {
  try {
    const data = await CustomerSchema.find({});
    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//@desc Update a customer in mongodb
//@route PUT /cmg/v0/:id
//@access Private
exports.updateCustomer = async (req, res, next) => {
  try {
    const data = await req.body;
    const { id } = req.params;
    const {modifiedCount} = await CustomerSchema.updateOne({ _id:id }, data);
    if(modifiedCount===0){
        return res.status(500).json({
            success:false,
            msg:'0 modified'
        })
    }
    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//@desc Delete Document from mongodb
//@route DELETE /cmg/v0/:id
//@access Private
// exports.deleteCustomerBillingData = async (req, res, next) => {
//   await deleteRecordById(req, res, CustomerBillingSchema);
// };
