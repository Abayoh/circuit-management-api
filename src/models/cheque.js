const mongoose = require('mongoose');

const ChequeSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      trim: true,
      required: [true, 'customerId is required'],
    },
    amount: {
      type: Number,
      min: 10,
      required: [true, 'Amount is required'],
    },
    imageUrl: {
      type: String,
      trim: true,
      required: [true, 'Image Url is required'],
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model('cheque', ChequeSchema);
