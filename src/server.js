const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
//const financialDataRouter = require('./routes/financial-data-routes.js');
const connectDb = require('./config/db-config.js');
const customerRouter = require('./routes/customer-route');
const chequeRouter = require('./routes/cheque-route');
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

//Enable login
//app.use('/cmg/v0/login', loginRouter);

//Enable authentication middleware
//app.use(authenticate);

//Customers routes
app.use('/cmg/v0/customers', customerRouter);

//Cheque routes
app.use('/cmg/v0/cheques', chequeRouter);

//Substation KPI routes
//app.use('/cmg/v0/substation-kpis', substationKpiRouter);

//Transmission Data routes
//app.use('/cmg/v0/transmission-data', transmissionDataRouter);
//Financial Data routes
//app.use('/cmg/v0/financial-data', financialDataRouter);
//app.use('/cmg/v0/transmission-data', transmissionDataRouter);

//Power Plant Data routes
//app.use('/cmg/v0/power-plant-data', powerPlantRouter);

//Customer Billing Data routes
//app.use('/cmg/v0/customer-billing-data', customerBillingRouter);

//Department Wage routes.
//app.use('/cmg/v0/department-wages', departmentWageRouter);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${process.env.PORT}`)
);
