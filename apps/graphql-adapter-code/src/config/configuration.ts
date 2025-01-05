import { DEFAULT_EUREKA_PORT, DEFAULT_HOST_PORT } from "./default-consts";

export const configuration = () => ({
    NODE_ENV: process.env.NODE_ENV,
    port: parseInt(process.env.PORT ?process.env.PORT : DEFAULT_HOST_PORT , 10),
    exchangee: process.env.AMQP_EXCHANGE ? process.env.AMQP_EXCHANGE : 'aux_exchange',
    routingkey: process.env.AMQP_ROUTINGKEY ? process.env.AMQP_ROUTINGKEY : 'nest-routingkey',
    queue: process.env.AMQP_QUEUE ? process.env.AMQP_QUEUE : 'nest-front-back',
    rabbitMQrl: process.env.RABBIT_MQ_URL || 'localhost:5672',
    rabbitMQuser: process.env.RABBIT_MQ_USER,
    rabbitMQpwd: process.env.RABBIT_MQ_PWD,
    frontUri: process.env.FRONT_URI || 'localhost:3005',
    gatewayUri: process.env.GATEWAY_URI || 'localhost:9090',
    eurekaPort: parseInt(process.env.EUREKA_PORT ? process.env.EUREKA_PORT : DEFAULT_EUREKA_PORT, 10) ,
    eurekaRegisterPort: parseInt(process.env.EUREKA_REGISTER_PORT ? process.env.EUREKA_REGISTER_PORT : DEFAULT_HOST_PORT, 10) ,
    eurekaHost: process.env.EUREKA_HOST || 'localhost',
    eurekaPath: process.env.EUREKA_PATH || '/eureka/apps',
    
  });