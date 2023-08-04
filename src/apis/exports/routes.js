const routes = (handlers) => [
  {
    method: 'POST',
    path: '/export/playlists/{id}',
    handler: (request, h) => handlers.postExportPlaylistHandler(request, h),
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;
