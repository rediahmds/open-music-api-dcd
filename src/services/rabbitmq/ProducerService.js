const amqplib = require('amqplib');
const config = require('../../utils/config');

const ProducerService = {
  sendMessage: async (queueName, message) => {
    const connection = await amqplib.connect(config.rabbitMq.server);
    const channel = await connection.createChannel();

    await channel.assertQueue(queueName, {
      durable: true,
    });

    await channel.sendToQueue(queueName, Buffer.from(message));

    setTimeout(() => {
      connection.close();
    }, 1000);
  },
};

module.exports = ProducerService;
