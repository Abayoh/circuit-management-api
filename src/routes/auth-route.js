const express = require('express');

const { loginUser, refreshToken,logout } = require('../controllers/auth-controller');

const authRouter = express.Router();

authRouter.route('/').post(loginUser);
authRouter.route('/refresh-token').post(refreshToken);
authRouter.route('/logout').delete(logout);



module.exports = authRouter;

