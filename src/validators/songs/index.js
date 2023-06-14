const InvariantError = require('../../exceptions/InvariantError');
const SongsPayloadSchema = require('./schema');

const SongsValidator = {
  validateSongsPayload: (requestPayload) => {
    const validationResult = SongsPayloadSchema.validate(requestPayload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = SongsValidator;
