import { Module } from '@nestjs/common';

import { UsersModule, commandHandlers, queryHandlers } from '@libs/users/users.module';
import { EurekaModule } from 'nest-eureka';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config/configuration';
import { UsersController } from './controllers/users.controller';
import { UserCreatedHandler } from './services/user-event-handler.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CqrsModule } from '@nestjs/cqrs';
const eventHandlers = [UserCreatedHandler]
const path = `${process.cwd()}/apps/nest-front-back/src/config/env/${process.env.NODE_ENV}.env`
@Module({
    imports: [...(process.env.NODE_ENV==='prod_ext' ?[] :[ConfigModule.forRoot({ 
      envFilePath: `${process.cwd()}/apps/nest-front-back/src/config/env/${process.env.NODE_ENV}.env`,
      load: [configuration] 
      })]), 
    EurekaModule.forRoot({
      eureka: {
        host: configuration().eurekaHost,
        port: 8761,
        registryFetchInterval: 1000,
        servicePath: '/eureka/apps',
        maxRetries: 3,
      },
      service: {
        name: 'grpc-nestjs',
        port: configuration().eurekaRegisterPort,
      },
    }),
     UsersModule,
     CqrsModule,
      ClientsModule.register([
      {
        name: 'external-message-bus',
        transport: Transport.RMQ,
        options: {
          urls: [
            configuration().rabbitMQuser ? `amqp://${configuration().rabbitMQuser}:${configuration().rabbitMQpwd}@${configuration().rabbitMQrl}` : `amqp://${configuration().rabbitMQrl}`,
          ],
          queue: `${configuration().queue}`,
          queueOptions: {
              durable: true
            },
        },
      },
    ])
    ],
    controllers: [UsersController],
  providers: [...eventHandlers, ...commandHandlers, ...queryHandlers],
})
export class AppModule {}
