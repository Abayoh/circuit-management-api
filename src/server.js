const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
//const financialDataRouter = require('./routes/financial-data-routes.js');
const connectDb = require('./config/db-config.js');
//const loginRouter = require('./routes/login-routes');
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
app.get('/', (req, res) => {
  return res.status(200).json({
    msg: 'Welcome to CCL Capacity Manager Dashboard API',
    version: '1.0.0',
    developer: 'Alexander Bayoh',
    github: 'www.github.com/abayoh/capacity-manager-api',
  });
});

//Enable login
//app.use('/lec-api/v0', loginRouter);

//Enable authentication middleware
//app.use(authenticate);

//Users routes
//app.use('/lec-api/v0/users', userRouter);

//Technical KPI routes
//app.use('/lec-api/v0/technical-kpis', technicalKpiRouters);

//Substation KPI routes
//app.use('/lec-api/v0/substation-kpis', substationKpiRouter);

//Transmission Data routes
//app.use('/lec-api/v0/transmission-data', transmissionDataRouter);
//Financial Data routes
//app.use('/lec-api/v0/financial-data', financialDataRouter);
//app.use('/lec-api/v0/transmission-data', transmissionDataRouter);

//Power Plant Data routes
//app.use('/lec-api/v0/power-plant-data', powerPlantRouter);


//Customer Billing Data routes
//app.use('/lec-api/v0/customer-billing-data', customerBillingRouter);

//Department Wage routes.
//app.use('/lec-api/v0/department-wages', departmentWageRouter);


const PORT = process.env.PORT || 5001;

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${process.env.PORT}`)
);
