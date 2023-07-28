const Joi = require('joi');

const currentYear = new Date().getFullYear();
const AlbumPayloadSchema = Joi.object({
  name: Joi.string().min(3).token().required(),
  year: Joi.number().min(1900).max(currentYear).required(),
});

module.exports = AlbumPayloadSchema;
