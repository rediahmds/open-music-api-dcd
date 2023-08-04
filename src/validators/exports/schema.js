const Joi = require('joi');

const ExportPlaylistsPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).trim().required(),
});

module.exports = ExportPlaylistsPayloadSchema;
