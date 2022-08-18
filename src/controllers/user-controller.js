const UserSchema = require('../models/User');
const bcrypt = require('bcryptjs');
const { findOne } = require('../models/User');

//@desc Create new user in the database
//@route POST /api/v0/users
//@access private
exports.createUser = async (req, res, next) => {
  try {
    const { fullName, email, phoneNumber, password, roles } = req.body;
    let user = await UserSchema.findOne({ $or: [{ email }, { phoneNumber }] });
    if (user) {
      return res.status(400).json({
        msg: 'User with this email or phone number already exist',
      });
    }

    user = new UserSchema({
      fullName,
      email,
      phoneNumber,
      hashedPassword: password,
      roles,
    });

    const salt = await bcrypt.genSalt(10);
    user.hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await (await user.save()).toObject();
    console.log(newUser);
    delete newUser.hashedPassword;
    return res.status(200).json({
      success: true,
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

//@desc Get all users from the database
//@route GET /api/v0/users
//@access private
exports.getUsers = async (req, res, next) => {
  try {
    const users = await UserSchema.find().select('-hashedPassword').lean();
    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

//@desc Get a user from the database
//@route GET /api/v0/users/:id
//@access private
exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await UserSchema.findById(id).select('-hashedPassword').lean();
    if (!user)
      res.status(404).json({
        msg: 'user does not exist',
      });
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

//@desc Update a user in the database
//@route PUT /api/v0/users/edit/:id
//@access private
exports.updateUser = async (req, res, next) => {
  try {
    const { fullName, phoneNumber } = req.body;
    if (!fullName || !phoneNumber) {
      return res.status(400).json({
        msg: 'Incomplete data',
      });
    }

    const { id } = req.params;

    const doesUserExist = await UserSchema.exists({ _id: id });
    if (!doesUserExist) {
      return res.status(404).json({
        msg: 'User does not exist',
      });
    }

    const { modifiedCount } = await UserSchema.updateOne(
      { _id: id },
      { fullName, phoneNumber }
    );
    if (modifiedCount === 0) {
      return res.status(500).json({
        success: false,
        msg: '0 modified',
      });
    }
    console.log(id);
    return res.status(200).json({
      success: true,
      data: { fullName, phoneNumber, id },
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};
//@desc change user password in the database
//@route PUT /api/v0/users/change-password/:id
//@access private
exports.changePassword = async (req, res, next) => {
  console.log('pass');
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
      return res.status(403).json({
        msg: 'Bad request, Please provide the old password as well as the new password.',
      });
    const { id } = req.params;

    //Get user from database
    const user = await UserSchema.findOne({ _id: id });
    if (!user) return res.status(404).json({ msg: 'user does not exist' });

    //Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.hashedPassword);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
    console.log('matched');
    //Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    //Update password in database
    const result = await UserSchema.updateOne(
      { _id: id },
      { password: hashedPassword }
    );
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

//@desc change user role in the database
//@route PUT /api/v0/users/change-role/:id
//@access private
exports.changeUserRole = async (req, res, next) => {
  try {
    const { role } = await req.body;
    if (!role)
      return res
        .status(400)
        .json({ msg: 'Bad request, User role is required' });

    const { id } = req.params;
    
    //Get user from database
    const user = await UserSchema.findById(id);
    if (!user) return res.status(404).json({ msg: 'user does not exist' });

    //Update role in database
    const result = await UserSchema.updateOne({ _id: id }, { role });
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
    if (!isValidId(id))
      return res.status(400).json({ msg: 'Invalid user Id' });
    const result = await UserSchema.findByIdAndDelete({ _id: id });
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

