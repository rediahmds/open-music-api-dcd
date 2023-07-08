const routes = (handlers) => [
  {
    method: 'POST',
    path: '/users',
    handler: (request, h) => handlers.postUserHandler(request, h),
  },
];

module.exports = routes;
