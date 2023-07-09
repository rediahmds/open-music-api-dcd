const Joi = require('joi');

const TrackPayloadSchema = Joi.object({
  songId: Joi.string()
    .min(5)
    .max(50)
    .regex(/song-.+/)
    .required(),
});

module.exports = TrackPayloadSchema;
