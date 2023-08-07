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
];

module.exports = routes;
