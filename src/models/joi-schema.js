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

module.exports = {
  userSchema,
  authSchema,
};
