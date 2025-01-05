import { DEFAULT_EUREKA_PORT, DEFAULT_EUREKA_REGISTER_PORT, DEFAULT_WS_PORT, DEFAULT_WS_TOPIC } from "./default-consts";

export const configuration = () => ({
    NODE_ENV: process.env.NODE_ENV,
    exchangee: process.env.AMQP_EXCHANGE ? process.env.AMQP_EXCHANGE : 'aux_exchange',
    routingkeyIn: process.env.AMQP_IN_ROUTINGKEY ? process.env.AMQP_ROUTINGKEY : 'ws-in-routingkey',
    routingkeyOut: process.env.AMQP_OUT_ROUTINGKEY ? process.env.AMQP_ROUTINGKEY : 'ws-out-routingkey',
    queueWsIn: process.env.AMQP_IN_QUEUE ? process.env.AMQP_IN_QUEUE: 'ws-in',
    queueWsOut: process.env.AMQP_OUT_QUEUE ? process.env.AMQP_OUT_QUEUE: 'ws-out',
    wsPort: parseInt(process.env.WS_PORT ?process.env.WS_PORT : DEFAULT_WS_PORT , 10),
    wsTopic: process.env.WS_PORT ?process.env.WS_PORT : DEFAULT_WS_TOPIC ,
    eurekaPort: parseInt(process.env.EUREKA_PORT ?process.env.EUREKA_PORT : DEFAULT_EUREKA_PORT , 10),
    eurekaPath: process.env.EUREKA_PATH || '/eureka/apps',
    eurekaRegisterPort: parseInt(process.env.EUREKA_REGISTER_PORT ?process.env.EUREKA_REGISTER_PORT : DEFAULT_EUREKA_REGISTER_PORT , 10),
    eurekaHost: process.env.EUREKA_HOST || 'localhost',
    rabbitMQrl: process.env.RABBIT_MQ_URL || 'localhost:5672',
    rabbitMQuser: process.env.RABBIT_MQ_USER,
    rabbitMQpwd: process.env.RABBIT_MQ_PWD,
   
  });