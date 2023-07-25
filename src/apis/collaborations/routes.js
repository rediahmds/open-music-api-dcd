const routes = (handlers) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: (request, h) => handlers.postCollaborationHandler(request, h),
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: (request, h) => handlers.deleteCollaborationHandler(request, h),
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;
