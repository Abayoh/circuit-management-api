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
    name: {
      type: String,
      trim: true,
      required: [true, 'Cheque name is required'],
      unique: true,
    },
  },
  { versionKey: false }
);



module.exports = mongoose.model('cheque', ChequeSchema);
