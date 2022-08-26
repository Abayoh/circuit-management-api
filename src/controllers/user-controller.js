const User = require('../models/User');
const { findOne } = require('../models/User');
const createError = require('http-errors');
const bcrypt = require('bcryptjs');
const { userSchema } = require('../models/joi-schema');

//@desc Create new user in the database
//@route POST /api/v0/users
//@access private
exports.createUser = async (req, res, next) => {
  try {
    const result = await userSchema.validateAsync(req.body);
    
    let user = await User.findOne({
      $or: [{ email: result.email }, { phoneNumber: result.phoneNumber }],
    });
    if (user) {
      throw createError.Conflict(
        `email:${email} or phoneNumbr:${phoneNumber} already exist`
      );
    }

    user = new User(result);

    const newUser = await user.save();

    //delete newUser.password;
    return res.status(200).json({
      success: true,
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

//@desc Get all users from the database
//@route GET /api/v0/users
//@access private
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').lean();
    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

//@desc Get a user from the database
//@route GET /api/v0/users/:id
//@access private
exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password').lean();
    if (!user) throw createError.NotFound('user do not exist');

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

//@desc Update a user in the database
//@route PUT /api/v0/users/edit/:id
//@access private
exports.updateUser = async (req, res, next) => {
  try {
    const { fullName, phoneNumber } = req.body;

    const { id } = req.params;

    const doesUserExist = await User.exists({ _id: id });
    if (!doesUserExist) throw createError.NotFound('user does not exit');

    const { modifiedCount } = await User.updateOne(
      { _id: id },
      { fullName, phoneNumber },
      { runValidators: true }
    );

    if (modifiedCount === 0) {
      return res.status(500).json({
        success: false,
        msg: '0 modified',
      });
    }

    return res.status(200).json({
      success: true,
      data: { fullName, phoneNumber, id },
    });
  } catch (error) {
    next(error);
  }
};
//@desc change user password in the database
//@route PUT /api/v0/users/change-password/:id
//@access private
exports.changePassword = async (req, res, next) => {
  
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
      throw createError.BadRequest(
        'Bad request, Please provide the old password as well as the new password.'
      );
    const { id } = req.params;

    //Get user from database
    const user = await User.findOne({ _id: id });
    if (!user) throw createError.NotFound('user does not exist');

    //Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw createError.Unauthorized('Wrong Password');

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(newPassword, salt);

    const result = await User.updateOne(
      { _id: id },
      { password },
      { runValidators: true }
    );
    return res.status(200).json({
      success: true,
      data: { _id: id },
    });
  } catch (error) {
    next(error);
  }
};

//@desc change user role in the database
//@route PUT /api/v0/users/change-role/:id
//@access private
exports.changeUserRole = async (req, res, next) => {
  try {
    const { role } = await req.body;
    const { id } = req.params;

    //Get user from database
    const user = await User.findById(id);
    if (!user) throw createError.NotFound('user does not exist');

    //Update role in database
    const result = await User.updateOne(
      { _id: id },
      { role },
      { runValidators: true }
    );
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

//@desc Delete User from mongodb
//@route DELETE /lec-api/v0/users/delete/:id
//@access Private
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ msg: 'Invalid user Id' });
    const result = await User.findByIdAndDelete({ _id: id });
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
