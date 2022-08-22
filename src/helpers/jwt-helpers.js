const jwt = require('jsonwebtoken');
const createError = require('http-errors');

module.exports = {
  signAccessToken: (userId, payloadData) => {
    return new Promise((resolve, reject) => {
      const payload = {
        ...payloadData,
      };
      const secret = process.env.ACCESS_TOKEN_SECRET;
      const options = {
        expiresIn: '5m',
        issuer: 'ccl.com.lr',
        audience: userId,
      };
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message);
          reject(createError.InternalServerError());
        }

        (sessions[userId] = { roles: payload.roles, refreshToken: '' }),
          resolve(token);
      });
    });
  },
  verifyAccessToken: (req, res, next) => {
    try {
      if (!req.headers['authorization']) throw createError.Unauthorized();
      const authHeader = req.headers['authorization'];

      const token = authHeader.split(' ')[1];

      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
          if (err.name === 'jsonWebTokenError')
            throw createError.Unauthorized();
          else throw createError.Unauthorized(err.message);
        }

        req.payload = payload;
        next();
      });
    } catch (error) {
      next(error);
    }
  },
  signRefreshToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = process.env.REFRESH_TOKEN_SECRET;
      const options = {
        expiresIn: '1y',
        issuer: 'ccl.com.lr',
        audience: userId,
      };
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message);
          reject(createError.InternalServerError());
        }

        sessions[userId] = { ...sessions[userId], refreshToken: token };

        resolve(token);
      });
    });
  },
  verifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, payload) => {
          if (err) return reject(createError.Unauthorized());
          const userId = payload.aud;

          //go to redis and verify that the refresh token exist
          if (sessions[userId]?.refreshToken !== refreshToken) {
            return reject(createError.Unauthorized());
          }
          //go to redis and retrieve user roles
          const { roles } = sessions[userId];

          resolve({ userId, roles });
        }
      );
    });
  },
  deletRefreshToken: (userId) => {
    //delete the refreshToken from Redis
    return new Promise((resolve, reject) => {
      //internal error occurs while delecting from redis
      if (false) return reject(createError.InternalServerError());
      delete sessions[userId];
      resolve(true);
    });
  },
};

const sessions = {};
