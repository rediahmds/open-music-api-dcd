const routes = (handlers) => [
  {
    method: 'POST',
    path: '/albums/{id}/likes',
    handler: (request, h) => handlers.postLikeHandler(request, h),
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'GET',
    path: '/albums/{id}/likes',
    handler: (request, h) => handlers.getLikeHandler(request, h),
  },
  {
    method: 'DELETE',
    path: '/albums/{id}/likes',
    handler: (request, h) => handlers.deleteLikeHandler(request, h),
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;
