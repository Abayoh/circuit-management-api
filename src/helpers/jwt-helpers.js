const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { promisify } = require('util');
const Redis = require('ioredis');

module.exports = {
  verifyAccessToken: (req, res, next) => {
    if (
      req.originalUrl === '/api/v0/auth' ||
      req.originalUrl === '/api/v0/auth/login' ||
      req.originalUrl === '/api/v0/auth/logout' ||
      req.originalUrl === '/api/v0/auth/refresh-token'
    ) {
      return next();
    }
    try {
      if (!req.headers['authorization']) throw createError.Unauthorized();
      const authHeader = req.headers['authorization'];

      const token = authHeader.split(' ')[1];
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
          if (err.name === 'jsonWebTokenError')
            throw createError.Unauthorized(err.message);
          else throw createError.Unauthorized(err.message);
        }

        const { aud, roles } = payload;
        req.user = { userId: aud, roles };
        next();
      });
    } catch (error) {
      next(error);
    }
  },
  verifyRefreshToken: (refreshToken) => {
    return new Promise(async (resolve, reject) => {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, payload) => {
          if (err) return reject(createError.Unauthorized());
          const userId = payload.aud;
          //go to redis and verify that the refresh token exist

          const redisClient = new Redis({
              host: process.env.REDIS_HOST,
              port: process.env.REDIS_PORT,
              password: process.env.REDIS_PASSWORD,
              username: process.env.REDIS_USERNAME,
          });

          redisClient.get(userId, (err, result) => {
            if (err) {
              console.log(err.message);
              reject(createError.InternalServerError());
              return;
            }

            if (!result) return reject(createError.Unauthorized());
            //if refresh token is not the same as the one in redis
            const userAuth = JSON.parse(result);
            if (refreshToken !== userAuth.refreshToken) {
              reject(createError.Unauthorized());
              return;
            }

            //send back the userRoles, name and userId
            resolve({ userId, roles: userAuth.roles, name: userAuth.name });
          });
        }
      );
    });
  },
  generateTokens: (userId, payloadData) => {
    return new Promise(async (resolve, reject) => {
      try {
        const accessToken = await signAccessToken(userId, payloadData);
        const refreshToken = await signRefreshToken(userId);

        //save refresh token, username, roles in redis
        const redisClient = new Redis({
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            password: process.env.REDIS_PASSWORD,
            username: process.env.REDIS_USERNAME,
        });

        const setAsync = promisify(redisClient.set).bind(redisClient);

        const userInfo = {
          name: payloadData.name,
          roles: payloadData.roles,
          refreshToken,
        };

        const replay = await setAsync(userId, JSON.stringify(userInfo), 'EX', 60 * 60 * 24 * 7);
        resolve({ accessToken, refreshToken });
      } catch (error) {
        return reject(createError.InternalServerError());
      }
    });
  },
  deletRefreshToken: (userId) => {
    //delete the refreshToken from Redis
    return new Promise((resolve, reject) => {
      //internal error occurs while delecting from redis
      const redisClient = new Redis({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
        username: process.env.REDIS_USERNAME,
      });

      redisClient.del(userId, (err, reply) => {
        if (err) {
          console.log(err.message);
          reject(createError.InternalServerError());
          return;
        }
        resolve(true);
      });
    });
  },
  decordToken: (token) => {
    return new Promise((resolve, reject) => {
      const { aud } = jwt.decode(token);
      if (aud) {
        resolve({ userId: aud });
      } else {
        return reject(createError.BadRequest());
      }
    });
  },
};

const signAccessToken = (userId, payloadData) => {
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

      resolve(token);
    });
  });
};

const signRefreshToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const options = {
      expiresIn: '7d',
      issuer: 'ccl.com.lr',
      audience: userId,
    };
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.log(err.message);
        reject(createError.InternalServerError());
      }

      resolve(token);
    });
  });
};

//const sessions = {};
