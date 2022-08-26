const mongoose = require('mongoose');

const CircuitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Circuit Name is required'],
      unique: true,
    },

    customerId:{
        type: String,
        trim: true,
        required:[true],
    },
    capacity:{
        type: String,
        trim: true,
        required:[true],
    },
    cost:{
        type: Number,
        required: [true, 'Cost is required'],
        min:0,
    }

  },

  { versionKey: false }
);

module.exports = mongoose.model('circuit', CircuitSchema);



