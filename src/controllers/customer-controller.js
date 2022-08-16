const CustomerBillingSchema = require('../models/CustomerBilling');
const {
  getAll,
  getRecordsByPeriod,
  getRecordsByYear,
  updateRecord,
  deleteRecordById,
} = require('../services/mongodb-services');

//@desc Create a new Customer  in mongodb
//@route POST /cmg/v0/customer
//@access Private
exports.createCustomer = async (req, res) => {
  try {
    const data = await req.body;
    if (!isCustomerTypeUnique(data.billings)) {
      return res.status(400).json({
        success: false,
        msg: 'Customer Type is not unique',
      });
    }
    const { period, paymentType } = data;
    //check for unique objects in array of objects
    const existingData = await CustomerBillingSchema.findOne({
      period,
      paymentType,
    });
    if (existingData) {
      return res.status(400).json({
        msg: `A record with period '${period}' and name '${paymentType}'  already exists`,
      });
    }
    const result = await CustomerBillingSchema.create(data);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//@desc Get all Customer Billing data from mongodb
//@route GET /lec-api/v0/customer-billing-data
//@access Private
exports.getCustomerBillingData = async (req, res) => {
  await getAll(req, res, CustomerBillingSchema);
};

//@desc Get all customer billing data for a given year from mongodb
//@route GET /lec-api/v0/customer-billing-data/:year
//@access Private
exports.getCustomerBillingDataByYear = async (req, res) => {
  await getRecordsByYear(req, res, CustomerBillingSchema);
};

//@desc Update a customer billing in mongodb
//@route PUT /lec-api/v0/department-wages/edit/:id
//@access Private
exports.updateCustomerBilling = async (req, res, next) => {
  await updateRecord(req, res, CustomerBillingSchema);
};

//@desc Delete Document from mongodb
//@route DELETE /lec-api/v0/customer-billing-data/delete/:id
//@access Private
exports.deleteCustomerBillingData = async (req, res, next) => {
  await deleteRecordById(req, res, CustomerBillingSchema);
};


//@desc Get a customer billing data for a given period from mongodb
//@route GET /lec-api/v0/customer-billing-data/by-period/:period
//@access Private
exports.getCustomerBillingDataByPeriod = async (req, res) => {
  await getRecordsByPeriod(req, res, CustomerBillingSchema);
};


//@desc Get unique list of payment types from mongodb
//@route GET /lec-api/v0/customer-billing-data/unique/names
//@access Private
exports.getUniquePaymentTypes = async(req, res, next)=>{
  try {
      const result = await CustomerBillingSchema.distinct("paymentType");
     
      return res.status(200).json({
          success: true,
          count:result.length,
          data: result
      });
      
  } catch (error) {
      res.status(500).json({ msg: error.message })
  }
}

//@desc Get list of list customer billings by paymentType from mongodb
//@route GET /lec-api/v0/customer-billing-data/unique/payment-types/:paymentType
//@access Private
exports.getCustomerBillingBypaymentType = async(req, res, next)=>{
  const {paymentType} = req.params;
  try {
      const result = await CustomerBillingSchema
                            .find({paymentType})
                            .sort({ month: -1, year: -1 })
                            .lean();
     
      return res.status(200).json({
          success: true,
          count:result.length,
          data: result
      });
      
  } catch (error) {
      res.status(500).json({ msg: error.message })
  }
}
//@desc Get yearly customer billing data from mongodb
//@route GET /lec-api/v0/customer-billing-data/yearly-data/:year
//@access Private
exports.getYearlyData = async(req, res, next)=>{
  const {year} = req.params;
  try {
      const result = await CustomerBillingSchema.aggregate([
        {
          "$match": {
            year: {
              "$in": [
                parseInt(year)
              ]
            }
          }
        },
        {
          "$group": {
            "_id": "$period",
            "totalEnergyBilled": {
              $sum: {
                "$sum": "$totalBill"
              }
            },
            "totalCustomerCount": {
              $sum: {
                "$sum": "$totalCustomerCount"
              }
            },
            "month": {
              "$max": "$month"
            }
          }
        },
        {
          "$sort": {
            month: -1
          }
        },
        {
          "$project": {
            totalEnergyBilled: 1,
            totalCustomerCount: 1,
            period: "$_id"
          }
        }
      ])
     
      return res.status(200).json({
          success: true,
          count:result.length,
          data: result
      });
      
  } catch (error) {
      res.status(500).json({ msg: error.message })
  }
}
//@desc Get yearly customer billing grouped by customer type from mongodb
//@route GET /lec-api/v0/customer-billing-data/total-by-customers/:year
//@access Private
exports.getYearlyDataByCustomerType = async(req, res, next)=>{
  const {year} = req.params;
  try {
      const result = await CustomerBillingSchema.aggregate([
        {
          "$match": {
            year: {
              "$in": [
                parseInt(year)
              ]
            }
          }
        },
        {
          "$unwind": "$billings"
        },
        {
          "$group": {
            "_id": "$billings.customerType",
            "totalCount": {
              "$sum": "$billings.customerCount"
            },
            "totalEnergyBilled": {
              "$sum": "$billings.energyBilled"
            }
          }
        }
      ])
     
      return res.status(200).json({
          success: true,
          count:result.length,
          data: result
      });
      
  } catch (error) {
      res.status(500).json({ msg: error.message })
  }
}
//@desc Get yearly customer billing grouped by customer type and payment type from mongodb
//@route GET /lec-api/v0/customer-billing-data/total-by-paymentType-and-customers/:year
//@access Private
exports.getYearlyDataByPaymentTypeAndCustomerType = async(req, res, next)=>{
  const {year} = req.params;
  try {
      const result = await CustomerBillingSchema.aggregate([
        {
          "$match": {
            year: {
              "$in": [
                parseInt(year)
              ]
            }
          }
        },
        {
          "$unwind": "$billings"
        },
        {
          "$group": {
            "_id": {
              "paymentType": "$paymentType",
              "customerType": "$billings.customerType"
            },
            "totalBill": {
              "$max": "$totalBill"
            },
            "totalCustomerCount": {
              "$max": "$totalCustomerCount"
            },
            "customerCount": {
              "$sum": "$billings.customerCount"
            },
            "energyBilled": {
              "$sum": "$billings.energyBilled"
            }
          }
        },
        {
          "$group": {
            "_id": "$_id.paymentType",
            totalCustomerCount: {
              "$max": "$totalCustomerCount"
            },
            totalBill: {
              "$max": "$totalBill"
            },
            billings: {
              "$push": {
                "customerType": "$_id.customerType",
                "customerCount": "$customerCount",
                "energyBilled": "$energyBilled"
              }
            }
          }
        }
      ])
     
      return res.status(200).json({
          success: true,
          count:result.length,
          data: result
      });
      
  } catch (error) {
      res.status(500).json({ msg: error.message })
  }
}
//@desc Get yearly customer billing totals by payment type from mongodb
//@route GET /lec-api/v0/customer-billing-data/totals-all-payment-types/:year
//@access Private
exports.getYearlyDataTotalsByPaymentType = async(req, res, next)=>{
  const {year} = req.params;
  try {
      const result = await CustomerBillingSchema.aggregate([
        {
          "$match": {
            year: {
              "$in": [
                parseInt(year)
              ]
            }
          }
        },
        {
          "$group": {
            "_id": "$paymentType",
            "totalBill": {
              "$sum": "$totalBill"
            },
            "totalCustomerCount": {
              "$max": "$totalCustomerCount"
            },
            "paymentType": {
              "$max": "$paymentType"
            }
          }
        }
      ])
     
      return res.status(200).json({
          success: true,
          count:result.length,
          data: result
      });
      
  } catch (error) {
      res.status(500).json({ msg: error.message })
  }
}

const isCustomerTypeUnique = (customers) => {
  const uniqueField = {};
  for (const customer of customers) {
    if (uniqueField[customer.customerType]) {
      return false;
    }
    uniqueField[customer.customerType] = true;
  }
  return true;
};
