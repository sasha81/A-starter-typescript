
export const configuration = () => ({
    NODE_ENV: process.env.NODE_ENV,
    exchangee: process.env.AMQP_EXCHANGE ? process.env.AMQP_EXCHANGE : 'aux_exchange',
    routingkey: process.env.AMQP_ROUTINGKEY ? process.env.AMQP_ROUTINGKEY : 'nest-routingkey',
    queue: process.env.AMQP_QUEUE,
    rabbitMQrl: process.env.RABBIT_MQ_URL || 'localhost:5672',
    rabbitMQuser: process.env.RABBIT_MQ_USER,
    rabbitMQpwd: process.env.RABBIT_MQ_PWD,
    //  jwt: {
    //   secret: process.env.JWT_SECRET,
    //   expiresIn: process.env.JWT_EXPIRES_IN,
    // }
  });