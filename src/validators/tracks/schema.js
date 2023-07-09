const Joi = require('joi');

const TrackPayloadSchema = Joi.object({
  songId: Joi.string()
    .min(5)
    .regex(/song-.+/)
    .required(),
});

module.exports = TrackPayloadSchema;
