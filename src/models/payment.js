const mongoose = require('mongoose');

const previousBalanceSchema = new mongoose.Schema(
  {
    paymentId: {
      type: String,
      trim: true,
      required: [true, 'PaymentId is required'],
    },
    amount: {
      type: Number,
      trim: true,
      required: [true, 'Amount is required'],
    },
  },
  { _id: false, versionKey: false }
);
// Billed schema
const billedSchema = new mongoose.Schema(
  {
    from: {
      type: Number,
      required: [true, 'Billed From is required'],
    },
    to: {
      type: Number,
      required: [true, 'Billed To is required'],
    },
  },
  { _id: false, versionKey: false }
);

const circuitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Circuit name is required'],
    },
    cost: {
      type: Number,
      min: 10,
      required: [true, 'Circuit Cost is required'],
    },
  },
  { _id: false, versionKey: false }
);

const PaymentSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      trim: true,
      required: [true, 'Amount is required'],
    },
    receiveBy: {
      type: String,
      trim: true,
      required: [true, 'Recieveby  is required'],
      unique: true,
    },
    customerName: {
      type: String,
      trim: true,
      required: [true, 'Customer name is required'],
      unique: true,
    },
    customerId: {
      type: String,
      trim: true,
      required: [true, 'Customer Id is required'],

    },
    chequeId: {
      type: String,
      trim: true,
      required: [true, 'ChequeId is required'],
      
    },
    circuit: circuitSchema,
    previousBalance: previousBalanceSchema,
    current: {
      type: Boolean,
    },
    Billed: billedSchema,
    balance: {
      type: Number,
      min: 0,
      required: [true, 'payment balance is required'],
    },
    depositedDate: {
      type: Number,
      required: [true, 'Deposited Date is required'],
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model('payment', PaymentSchema);
