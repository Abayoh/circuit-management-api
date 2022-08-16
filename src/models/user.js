const { default: mongoose } = require('mongoose');

const user = {
  _id: 'usr1',
  fullName: 'alex bayoh',
  email: 'abayoh@ccl.com.lr',
  role: ['admin'],
  phoneNumber: '088903445',
  hashPassword: '1234',
};

const validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      required: [true, 'User name is required'],
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: 'Email address is required',
      validate: [validateEmail, 'Please fill a valid email address'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address',
      ],
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: ['Admin', 'Manager', 'User', 'Guest'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone Number is required'],
      min: [10, 'Phone Number should be atleast ten digits'],
      unique: true,
    },
    hashedPassword: {
      type: String,
      required: [true],
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model('user', UserSchema);
