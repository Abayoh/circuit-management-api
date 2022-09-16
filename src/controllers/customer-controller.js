const Customer = require('../models/customer');
const common = require('./common');
const { customerSchema } = require('../models/joi-schema');

const { Storage } = require('@google-cloud/storage');
const path = require('path');

// Creates a client
const storage = new Storage({
  keyFilename: path.join(__dirname, '../../cred.json'),
});
const bucketName = 'customer_images_bucket1';

function uploadImage(file, destFileName) {
  return new Promise((resolve, reject) => {
    const blob = storage.bucket(bucketName).file(destFileName);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', (err) => {
      return reject(err);
    });

    blobStream.on('finish', () => {
      resolve(destFileName);
    });

    blobStream.end(file.buffer);
  });
}

//@desc Create a new Customer  in mongodb
//@route POST /cmg/v0/customer
//@access Private
exports.createCustomer = async (req, res, next) => {
  try {
    const customer = JSON.parse(req.body.custInfo);
    const file = req.file;
    const fileName = req.body.fileName;
    if(!customer || !file || !fileName) throw createError.UnprocessableEntity('customer, file and fileName cannot be undefined');

    const result = await customerSchema.validateAsync(customer);

    //upload image to google cloud storage
    const name = await uploadImage(file, fileName);
    await storage.bucket(bucketName).file(fileName).makePublic();
    const imageUrl = `https://storage.googleapis.com/${bucketName}/${name}`;
    result.imageUrl = imageUrl;

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
