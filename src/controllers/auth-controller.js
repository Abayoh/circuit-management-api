const UserSchema = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authSchema } = require('../models/joi-schema');
const createError = require('http-errors');
const {
  signAccessToken,
  verifyRefreshToken,
  signRefreshToken,
  deletRefreshToken
} = require('../helpers/jwt-helpers');

//@desc Authenticate user and get token
//@route POST /api/v0/login
//@access public
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = await authSchema.validateAsync(req.body);

    let user = await UserSchema.findOne({ email });

    if (!user) throw createError.Unauthorized('Invalid credentials');

    const isMatched = await user.isValidPassword(password);

    if (!isMatched) throw createError.Unauthorized('Invalid credentials');

    const payload = {
      roles: user.roles,
    };

    const userData = {
      email: user.email,
      phoneNumber: user.phoneNumber,
      fullName: user.fullName,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt,
    };
    const accessToken = await signAccessToken(user.id, payload);

    const refreshToken = await signRefreshToken(user.id);

    res.status(200).json({ accessToken, refreshToken, userData });
  } catch (error) {
    next(error);
  }
};
exports.refreshToken = async (req, res, next) => {
  try {
    let { refreshToken } = req.body;
    if (!refreshToken) throw createError.BadRequest();
    const { userId, roles } = await verifyRefreshToken(refreshToken);

    const accessToken = await signAccessToken(userId, { roles });
    refreshToken = await signRefreshToken(userId);

    res.status(200).json({
      success: true,
      data: { accessToken, refreshToken },
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if(!refreshToken) throw createError.BadRequest();

    const {userId, roles} = await verifyRefreshToken(refreshToken);
    await deletRefreshToken(userId);
    res.sendStatus(204);
  } catch (err) {
    next(err); 
  }
};
