const mongoose = require('mongoose');

// old schema
const oldSchema = new mongoose.Schema(
  {
    entityId: {
      type: String,
      required: [true, 'ObjectId  is required'],
    },
    data: {
      type: {},
      required: [true, 'old data is required'],
    },
  },
  { _id: false, versionKey: false }
);

const LogSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      trim: true,
      required: [true, 'UserId is required'],
    },
    action: {
      type: String,
      trim: true,
      required: [true, 'Action is required'],
    },
    dataType: {
      type: String,
      trim: true,
      required: [true, 'ObjectType is required'],
    },
    old: oldSchema,
  },
  { versionKey: false } 
);

module.exports = mongoose.model('log', LogSchema);
