const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const createError = require('http-errors');
const { default: mongoose } = require('mongoose');
const {verifyAccessToken} = require('./helpers/jwt-helpers')
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
//Body Parser
app.use(express.json());

//Enable cors
app.use(cors());

//Add home response
app.get('/cmg/v0', (req, res) => {
  return res.status(200).json({
    msg: 'Welcome to CCL Capacity Manager Dashboard API',
    version: '1.0.0',
    developer: 'Alexander Bayoh',
    github: 'www.github.com/abayoh/capacity-manager-api',
  });
});

//Enable auth
app.use('/cmg/v0/auth', authRouter);

//Enable authentication middleware
//app.use(authenticate);


//Customers routes
app.use('/cmg/v0/customers', verifyAccessToken, customerRouter);

//Cheque routes
app.use('/cmg/v0/cheques',verifyAccessToken, chequeRouter);

//Circuit routes
app.use('/cmg/v0/circuits',verifyAccessToken, circuitRouter);

//Log routes
app.use('/cmg/v0/logs',verifyAccessToken, logRouter);

//Payment routes
app.use('/cmg/v0/payments',verifyAccessToken, paymentRouter);

//User routes
app.use('/cmg/v0/users', verifyAccessToken, userRouter);

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  if (err instanceof mongoose.Error.ValidationError || err.isJoi)
    err.status = 422;
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${process.env.PORT}`)
);
