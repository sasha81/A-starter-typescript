import { RabbitMQModule} from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { AmqpAdapterService } from './amqp-adapter.service';
import { configuration } from './config/configuration';
import { ConfigModule } from '@nestjs/config';
import { UsersModule, commandHandlers, queryHandlers } from '@libs/users/users.module';
import { UserCreatedHandler } from './amqp-event-handler.service';
import { CqrsModule } from '@nestjs/cqrs';
console.log('process.env.NODE_ENV: ', process.env.NODE_ENV)
console.log('process.cwd(): ', process.cwd())


const eventHandlers = [UserCreatedHandler]

@Module({
  imports: [...(process.env.NODE_ENV === 'prod_ext' ? [] : [ConfigModule.forRoot({
    envFilePath: `${process.cwd()}/apps/amqp-adapter/src/config/env/${process.env.NODE_ENV}.env`,
    load: [configuration]
  })])
    ,

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


  }), AmqpAdapterModule, CqrsModule, UsersModule],

  providers: [AmqpAdapterService, ...eventHandlers, ...commandHandlers, ...queryHandlers],
})
export class AmqpAdapterModule { }

