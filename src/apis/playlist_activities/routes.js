const routes = (handlers) => [
  {
    method: 'GET',
    path: '/playlists/{id}/activities',
    handler: (request, h) => handlers.getActivitiesHandler(request, h),
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;
