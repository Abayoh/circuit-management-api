const UserSchema = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authSchema } = require('../models/joi-schema');
const createError = require('http-errors');
const {
  generateTokens,
  verifyRefreshToken,
  deletRefreshToken,
  decordToken,
} = require('../helpers/jwt-helpers');

//@desc Authenticate user and get token
//@route POST /api/v0/auth/login
//@access public
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = await authSchema.validateAsync(req.body);

    let user = await UserSchema.findOne({ email });

    if (!user) throw createError.Unauthorized('Invalid credentials');

    const isMatched = await user.isValidPassword(password);

    if (!isMatched) throw createError.Unauthorized('Invalid credentials');

    const payload = {
      name: user.fullName,
      roles: user.roles,
    };

    const userData = {
      email: user.email,
      phoneNumber: user.phoneNumber,
      fullName: user.fullName,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt,
      roles: user.roles,
    };
    const { accessToken, refreshToken } = await generateTokens(
      user.id,
      payload
    );

    res.cookie('refreshToken', refreshToken, {
      maxAge: 3.154e10, // 1 year
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    res.send(accessToken);
  } catch (error) {
    next(error);
  }
};
exports.refreshToken = async (req, res, next) => {
  try {
    let { refreshToken } = req.cookies;
    if (!refreshToken) throw createError.BadRequest();
    const { userId, roles, name } = await verifyRefreshToken(refreshToken);
    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(
      userId,
      { roles, name }
    );

    res.cookie('refreshToken', newRefreshToken, {
      maxAge: 3.154e10, // 1 year
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    res.send(accessToken);
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) throw createError.BadRequest();

    const { userId } = await decordToken(refreshToken);
    await deletRefreshToken(userId);

    res.cookie('refreshToken', '', {
      maxAge: 0,
      httpOnly: true,
    });

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

exports.getLoginUser = async (req, res, next) => {
  try {
    let { userId } = req.user;
    let user = await UserSchema.findOne({ _id: userId });

    if (!user) createError.NotFound();

    const userData = {
      email: user.email,
      phoneNumber: user.phoneNumber,
      fullName: user.fullName,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt,
      roles: user.roles,
    };

    res.send(userData);
  } catch (err) {
    next(err);
  }
};
