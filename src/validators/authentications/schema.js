const Joi = require('joi');

const PostAuthenticationPayloadSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(3).required(), // min(3) menyesuaikan dengan test case
});

const PutAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().min(1).regex(/^[A-Za-z0-9+/=_.-]+$/).required(),
});

const DeleteAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().min(1).regex(/^[A-Za-z0-9+/=_.-]+$/).required(),
});

module.exports = {
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema,
};
