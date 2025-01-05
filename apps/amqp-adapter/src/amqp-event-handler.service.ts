import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { UserCreatedEvent } from '@libs/users/events/user-created.event';
import { AmqpCreateUserDto } from 'apps/amqp-simple-adapter/src/dto/users-dto';



@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler implements IEventHandler<UserCreatedEvent> {

  constructor(private readonly amqpConnection: AmqpConnection) { }

  handle(event: UserCreatedEvent) {

    this.amqpConnection.publish(
      process.env.AMQP_EXCHANGE ? process.env.AMQP_EXCHANGE : 'aux_exchange',
      process.env.AMQP_EVENT_ROUTINGKEY ? process.env.AMQP_EVENT_ROUTINGKEY : 'nest-event-routingkey',
      { ...event })

  }
}