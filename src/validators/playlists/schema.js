const Joi = require('joi');

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().min(1).trim().required(),
});

module.exports = PlaylistPayloadSchema;
