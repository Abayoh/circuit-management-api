const express = require('express');

const { loginUser, refreshToken,logout, getLoginUser } = require('../controllers/auth-controller');

const authRouter = express.Router();

authRouter.route('/').post(loginUser);
authRouter.route('/refresh-token').get(refreshToken);
authRouter.route('/logout').delete(logout);
authRouter.route('/login-user').get(getLoginUser);



module.exports = authRouter;

