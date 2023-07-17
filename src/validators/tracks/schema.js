const Joi = require('joi');

const TrackPayloadSchema = Joi.object({
  songId: Joi.string().min(3).max(50).required(),
});

module.exports = TrackPayloadSchema;
