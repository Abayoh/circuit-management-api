const { required } = require('@hapi/joi');
const Joi = require('@hapi/joi');

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
    //.regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  amount: Joi.number().min(50).required(),
  name: Joi.string().required(),
});

const address = Joi.object({
  address1: Joi.string().required(),
  street: Joi.string().required(),
  city: Joi.string().required(),
  county: Joi.string().required(),
}).required();
const customerSchema = Joi.object({
  name: Joi.string().required(),
  isShareholder: Joi.boolean().required(),
  contacts: Joi.string().required(),
  address: address,
  share: Joi.number().min(0).max(100).required(),
});

const circuitSchema = Joi.object({
  name: Joi.string().required(),
  customerId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  capacity: Joi.string().required(),
  customerName: Joi.string().required(),
  cost: Joi.number().min(1000).required(),
  miu: Joi.number().min(0).required(),
});

const logSchema = Joi.object({
  userId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  action: Joi.string().required(),
  dataType: Joi.string().required(),
  old: Joi.object().required(),
});

const previousBalanceSchema = Joi.object({
  paymentId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  amount: Joi.number().min(0).required(),
}).required();
const billedSchema = Joi.object({
  from: Joi.date().required(),
  to: Joi.date().required(),
}).required();
const paymentCircuitSchema = Joi.object({
  name: Joi.string().required(),
  cost: Joi.number().min(10).required(),
}).required();
const paymentSchema = Joi.object({
  amount: Joi.number().min(1).required(),
  receiveBy: Joi.string().required(),
  customerName: Joi.string().required(),
  balance: Joi.number().min(0).required(),
  current: Joi.bool().required(),
  customerId: Joi.string()
    // .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  chequeId: Joi.string().required(),
  dateDeposited: Joi.date(),
  previousBalance: previousBalanceSchema,
  billed: billedSchema,
  circuit: paymentCircuitSchema,
});

const paymentsSchema = Joi.array().items(paymentSchema);

module.exports = {
  userSchema,
  authSchema,
  chequeSchema,
  customerSchema,
  circuitSchema,
  logSchema,
  paymentsSchema,
};
