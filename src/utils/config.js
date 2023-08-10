const config = {
  app: {
    port: process.env.PORT,
    host: process.env.HOST,
  },
  rabbitMq: {
    server: process.env.RABBITMQ_SERVER,
  },
  redis: {
    host: process.env.REDIS_SERVER,
  },
};

module.exports = config;
