import { Module } from '@nestjs/common';
import {UsersModule, commandHandlers, queryHandlers} from '@libs/users/users.module'
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config/configuration';
import { EurekaModule } from 'nest-eureka';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RestService } from './services/rest-adapter.service';
import { CqrsModule } from '@nestjs/cqrs';
import { UserCreatedHandler } from './services/user-event-handler.service';
import { UserMutationController } from './controllers/user-mutation.controller';
import { UserQueryController } from './controllers/user-query.controller';


const eventHandlers = [UserCreatedHandler]
@Module({
  imports: [...(process.env.NODE_ENV==='prod_ext' ?[] :[ConfigModule.forRoot({ 
    envFilePath: `${process.cwd()}/apps/rest-adapter/src/config/env/${process.env.NODE_ENV}.env`,
    load: [configuration] 
})]),
EurekaModule.forRoot({
  eureka: {
    host: configuration().eurekaHost,
    port: configuration().eurekaPort,
    registryFetchInterval: 1000,
    servicePath: configuration().eurekaPath,
    maxRetries: 3,
  },
  service: {
    name: 'rest-adapter',
    port:configuration().port,
  },
}), 
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
  ]),


    UsersModule, CqrsModule],
  controllers: [UserMutationController, UserQueryController],
  providers:[RestService,UserCreatedHandler,  ...eventHandlers, ...commandHandlers, ...queryHandlers]
  
})
export class RestAdapterModule {}
