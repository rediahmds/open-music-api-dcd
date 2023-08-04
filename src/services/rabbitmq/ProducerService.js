const amqplib = require('amqplib');

const ProducerService = {
  sendMessage: async (queueName, message) => {
    const connection = await amqplib.connect(process.env.RABBITMQ_SERVER);
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
