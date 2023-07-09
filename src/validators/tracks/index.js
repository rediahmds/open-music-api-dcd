const TrackPayloadSchema = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const TracksValidator = {
  validateTrackPayload: (payload) => {
    const validationResult = TrackPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = TracksValidator;
