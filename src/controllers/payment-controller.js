const Payment = require('../models/payment');
const Cheque = require('../models/cheque');
const common = require('./common');
const createError = require('http-errors');
const mongoose = require('mongoose');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const { paymentsSchema, chequeSchema } = require('../models/joi-schema');

// Creates a client
const storage = new Storage({
  keyFilename: path.join(__dirname, '../../cred.json'),
});
const bucketName = 'ccl_cheque_images_bucket-1';

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

//Save Customer Payments, cheque details and upload file
const savePayments = async (payments, chequeInfo, file) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    for (let nPayment of payments) {
      let oPayment = await Payment.findOne({
        'circuit.name': nPayment.circuit.name,
        current: true,
      }).session(session);
      if (oPayment) {
        oPayment.current = false;
        const result = await oPayment.save();
      }
    }

    const cheque = await Cheque.create([chequeInfo], { session });
    const newPayments = await Payment.create([...payments], { session });

    const name = await uploadImage(file, chequeInfo.name);

    // Once the transaction is committed, the write operation becomes

    await session.commitTransaction();
    await session.endSession();
    return { newPayments, cheque };
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw createError(err);
  }
};

//@desc Create a new Payment  in mongodb
//@route POST /cmg/v0/Payment
//@access Private
exports.createPayments = async (req, res, next) => {
  try {
    let { payments, chequeInfo } = req.body;
    let file = req.file;
    //check for all values
    if (!payments || !chequeInfo || !file)
      return createError.UnprocessableEntity(
        'payments, chequeInfo and oldPayments cannot be undefined'
      );

    payments = JSON.parse(payments);
    chequeInfo = JSON.parse(chequeInfo);

    await paymentsSchema.validateAsync(payments);
    await chequeSchema.validateAsync(chequeInfo);

    const { newPayments, cheque } = await savePayments(
      payments,
      chequeInfo,
      file
    );

    //Then start a transaction to commit the remaining documents
    res.status(200).send({ newPayments, cheque });
  } catch (err) {
    next(err);
  }
};

//@desc Get all Payment  data from mongodb
//@route GET /cmg/v0/Payment-billing-data
//@access Private
exports.getPayments = async (req, res, next) => {
  common.readAll(res, Payment, next);
};
