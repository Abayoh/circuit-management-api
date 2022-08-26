const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const userSchema = Joi.object({
  fullName: Joi.string().min(3).required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string()
    .regex(/^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    .error(
      new Error(
        'Password must be strong.  At least one alphabet. At least one digit. At least one special character. Minimum eight in length'
      )
    )
    .required(),
  roles: Joi.array().items(Joi.string().valid('admin', 'user')).required(),
  phoneNumber: Joi.string()
    .regex(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]{9,}$/)
    .error(new Error('/phoneNumber/ is invalid'))
    .required(),
});
const authSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string()
    .regex(/^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    .error(
      new Error(
        'Password must be strong.  At least one alphabet. At least one digit. At least one special character. Minimum eight in length'
      )
    )
    .required(),
});


const chequeSchema = Joi.object({
  customerId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  amount: Joi.number().min(0).required(),
  imageUrl: Joi.string().required(),
});


const circuitSchema = Joi.object({
  name: Joi.string().required(),
  customerId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  capacity: Joi.string().required(),
  cost: Joi.number().min(1000).required(),
});


const address = Joi.object({
  address1: Joi.string().required(),
  street: Joi.string().required(),
  city: Joi.string().required(),
  county: Joi.string().required(),
});
const customerSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  contacts: Joi.string().required(),
  address: Joi.object(address).required(),
});


const logSchema = Joi.object({
  userId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  action: Joi.string().required(),
  dataType: Joi.string().required(),
  old: Joi.object(),
});


const previousBalanceSchema = Joi.object({
  paymentId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  amount: Joi.number().min(1),
});
const billedSchema = Joi.object({
  from: Joi.date(),
  to: Joi.date(),
});
const paymentCircuitSchema = Joi.object({
  name: Joi.string().required(),
  cost: Joi.number().min(10).required(),
});
const paymentSchema = Joi.object({
  amount: Joi.number().min(1),
  receiveBy: Joi.string().required(),
  customerName: Joi.string().required(),
  customerId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  chequeId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  dateDeposited: Joi.date(),
  previousBalance: Joi.object(previousBalanceSchema),
  billed: Joi.object(billedSchema),
  circuit: Joi.object(paymentCircuitSchema),
});

module.exports = {
  userSchema,
  authSchema,
  chequeSchema,
  circuitSchema,
  customerSchema,
  logSchema,
  paymentSchema,
};
