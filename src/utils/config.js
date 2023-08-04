const config = {
  app: {
    port: process.env.PORT,
    host: process.env.HOST,
  },
  rabbitMq: {
    server: process.env.RABBITMQ_SERVER,
  },
};

module.exports = config;
