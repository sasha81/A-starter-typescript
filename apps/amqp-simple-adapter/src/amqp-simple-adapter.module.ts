import { Module, OnModuleInit } from '@nestjs/common';
import { configuration } from './config/configuration';
import { ConfigModule } from '@nestjs/config';
import { UsersModule, queryHandlers } from '@libs/users/users.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AmqpAdapterController } from './controllers/amqp-example.controller';
import { CqrsModule } from '@nestjs/cqrs';

import { AmqpSenderService } from './services/amqp-sender.service';
import { AmqpAdapterService } from './services/amqp-adapter.service';
import { AmqpAdapterCommandController } from './controllers/amqp-command.controller';
import { AmqpAdapterQueryController } from './controllers/amqp-query.controller';

@Module({
  imports: [...(process.env.NODE_ENV === 'prod_ext' ? [] : [ConfigModule.forRoot({
    envFilePath: `${process.cwd()}/apps/amqp-simple-adapter/src/config/env/${process.env.NODE_ENV}.env`,
    load: [configuration]
  })]),
  ClientsModule.register([
    {
      name: 'rabbit-mq-module',
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
    AmqpAdapterModule, CqrsModule, UsersModule],
  controllers: [AmqpAdapterController, AmqpAdapterCommandController, AmqpAdapterQueryController],
  providers: [AmqpAdapterController, AmqpAdapterCommandController, AmqpAdapterQueryController, AmqpAdapterService, AmqpSenderService, ...queryHandlers],
})
export class AmqpAdapterModule { }