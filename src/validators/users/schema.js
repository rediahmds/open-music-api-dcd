const Joi = require('joi');

const UserPayloadSchema = Joi.object({
  username: Joi.string().min(3).max(50).token()
    .required()
    .messages({
      'string.token':
      'Username harus berisi karakter alfanumerik dan underscore.',
      'string.min': 'Username tidak boleh kurang dari {#limit} karakter.',
      'string.max': 'Username tidak boleh lebih dari {#limit} karakter.',
    }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password setidaknya harus berisi {#limit} karakter.',
  }),
  fullname: Joi.string().min(1).required().messages({
    'string.min': 'Fullname tidak boleh kurang dari {#limit} karakter',
    'string.max': 'Fullname tidak boleh lebih dari {#limit} karakter.',
  }),
});

module.exports = { UserPayloadSchema };
