import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { configuration } from './config/configuration';
import { ConfigModule } from '@nestjs/config';
import { AmqpAdapterService } from './amqp/amqp-adapter.service';
import { SocketService } from './services/socket.service';
import { WsGateway } from './controllers/ws.gateway';
import { EurekaModule } from 'nest-eureka';
import { ZodValidationExceptionFilter } from './filter/zod-filter';
import { SendSocketService } from './services/send-socket.service';
console.log('process.env.NODE_ENV: ', process.env.NODE_ENV)
console.log('process.cwd(): ', process.cwd())
@Module({
  imports: [...(process.env.NODE_ENV === 'prod_ext' ? [] : [ConfigModule.forRoot({
    envFilePath: `${process.cwd()}/apps/ws-gateway/src/config/env/${process.env.NODE_ENV}.env`,
    load: [configuration]
  })])
    ,
  EurekaModule.forRoot({
    eureka: {
      host: configuration().eurekaHost,
      port: configuration().eurekaPort,
      registryFetchInterval: 1000,
      servicePath: configuration().eurekaPath,
      maxRetries: 3,
    },
    service: {
      name: 'ws-gateway',
      port: configuration().eurekaRegisterPort,
    },
  }),
  RabbitMQModule.forRoot(RabbitMQModule, {
    exchanges: [
      {
        name: `${configuration().exchangee}`,
        type: 'direct',

      },
    ],
    uri: configuration().rabbitMQuser ?
      `amqp://${configuration().rabbitMQuser}:${configuration().rabbitMQpwd}@${configuration().rabbitMQrl}`
      : `amqp://${configuration().rabbitMQrl}`,
    connectionInitOptions: { wait: true },
    enableControllerDiscovery: true,


  }), WsGatewayModule],

  providers: [ZodValidationExceptionFilter, AmqpAdapterService, SocketService, WsGateway, SendSocketService],
})
export class WsGatewayModule { }

