const routes = (handlers) => [
  {
    method: 'POST',
    path: '/authentications',
    handler: (request, h) => handlers.postAuthenticationHandler(request, h),
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: (request, h) => handlers.putAuthenticationHandler(request, h),
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: (request, h) => handlers.deleteAuthenticationHandler(request, h),
  },
];

module.exports = routes;
