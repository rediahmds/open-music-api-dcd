const InvariantError = require('../../exceptions/InvariantError');
const AlbumsPayloadSchema = require('./schema');

const AlbumsValidator = {
  validateAlbumsPayload: (requestPayload) => {
    const validationResult = AlbumsPayloadSchema.validate(requestPayload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AlbumsValidator;
