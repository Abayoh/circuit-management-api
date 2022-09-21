const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const { default: mongoose } = require('mongoose');
const { verifyAccessToken } = require('./helpers/jwt-helpers');
const connectDb = require('./config/db-config.js');

const customerRouter = require('./routes/customer-route');
const chequeRouter = require('./routes/cheque-route');
const circuitRouter = require('./routes/circuit-route');
const logRouter = require('./routes/log-route');
const paymentRouter = require('./routes/payment-route');
const userRouter = require('./routes/user-route');
const authRouter = require('./routes/auth-route');
//

dotenv.config();

//Connect to DB
connectDb();

const app = express();
app.use(cookieParser());
//Body Parser
app.use(express.json());

//Enable cors
app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  })
);

//Add home response
app.get('/api/v0', (req, res) => {
  return res.status(200).json({
    msg: 'Welcome to CCL Capacity Manager Dashboard API',
    version: '1.0.0',
    developer: 'Alexander Bayoh',
    github: 'www.github.com/abayoh/capacity-manager-api',
  });
});

//Enable auth
app.use('/api/v0/auth', verifyAccessToken, authRouter);

//Enable authentication middleware
//app.use(authenticate);

//Customers routes
app.use('/api/v0/customers', verifyAccessToken, customerRouter);

//Cheque routes
app.use('/api/v0/cheques', verifyAccessToken, chequeRouter);

//Circuit routes
app.use('/api/v0/circuits', verifyAccessToken, circuitRouter);

//Log routes
app.use('/api/v0/logs', logRouter);

//Payment routes
app.use('/api/v0/payments', verifyAccessToken, paymentRouter);

//User routes
app.use('/api/v0/users', verifyAccessToken, userRouter);

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  if (err instanceof mongoose.Error.ValidationError || err.isJoi)
    err.status = 422;
  if (err instanceof mongoose.Error.MongooseServerSelectionError) {
    console.log(err.message);
    err.status = 500;
    err.message = 'Cannot Connect To DB';
  }

  if (err instanceof multer.MulterError) {
    console.log(err.message);
    err.stack = 422;
  }

  res.status(err.status || 500);

  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('listening on port', port);
});
