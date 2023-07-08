const Joi = require('joi');

// token base64-URL harus mengikuti pola ini
const base64UrlRegex = /^[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+){2}$/;

const PostAuthenticationPayloadSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(3).required(), // min(3) menyesuaikan dengan test case
});

const PutAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().min(1).regex(base64UrlRegex).required(),
});

const DeleteAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().min(1).regex(base64UrlRegex).required(),
});

module.exports = {
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema,
};
