const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');

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
    roles: [
      {
        type: String,
        required: [true, 'Role(s) is required'],
        enum: ['admin', 'manager', 'user', 'guest'],
      },
    ],
    phoneNumber: {
      type: String,
      required: [true, 'Phone Number is required'],
      min: [10, 'Phone Number should be atleast ten digits'],
      unique: true,
    },
    password: {
      type: String,
      required: [true],
      minlength: 5,
    },
  },
  { versionKey: false }
);

UserSchema.methods.isValidPassword = async function(password){
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error
  }
}

const hashedPassword = async function (next) {
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
};

UserSchema.pre('save', hashedPassword);

//UserSchema.pre('updateOne', hashedPassword);

module.exports = mongoose.model('user', UserSchema);
