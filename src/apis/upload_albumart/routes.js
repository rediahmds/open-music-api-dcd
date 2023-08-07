const path = require('path');

const routes = (handlers) => [
  {
    method: 'POST',
    path: '/albums/{id}/covers',
    handler: (request, h) => handlers.postUploadImageHandler(request, h),
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 512000,
      },
    },
  },
  {
    method: 'GET',
    path: '/uploads/album/cover/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, '../../..', 'uploads/album/cover/'),
      },
    },
  },
];

module.exports = routes;
