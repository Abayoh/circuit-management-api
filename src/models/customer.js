const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    address1: {
      type: String,
      required: [true, 'Address1 is required'],
      trim: true,
    },
    street: {
      type: String,
      trim: true,
      required: [true, 'Street is required'],
    },
    city: {
      type: String,
      trim: true,
      required: [true, 'City is required'],
    },
    county: {
      type: String,
      trim: true,
      required: [true, 'County is required'],
    },
  },

  { _id: false, versionKey: false }
);

const CustomerSchema = new mongoose.Schema(
  {
    _id:{
      type:String,
    },
    name: {
      type: String,
      trim: true,
      required: [true, 'Customer Name is required'],
      unique: true,
    },
    type: {
      type: String,
      trim: true,
      required: [true, 'Customer Type is required'],
    },
    address: addressSchema,
    contacts: {
      type: String,
      trim: true,
      required: [true, 'Contact is required'],
    },
  },

  { versionKey: false }
);

module.exports = mongoose.model('customers', CustomerSchema);
