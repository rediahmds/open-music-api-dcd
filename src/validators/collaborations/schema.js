const Joi = require('joi');

const CollaborationPayloadSchema = Joi.object({
  playlistId: Joi.string().min(3).required(),
  userId: Joi.string().min(3).required(),
});

module.exports = { CollaborationPayloadSchema };
