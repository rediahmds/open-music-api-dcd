const Joi = require('joi');

const currentYear = new Date().getFullYear();
const SongPayloadSchema = Joi.object({
  title: Joi.string().min(3).required(),
  year: Joi.number().min(1900).max(currentYear).required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number(),
  albumId: Joi.string().max(50),
});

module.exports = SongPayloadSchema;
