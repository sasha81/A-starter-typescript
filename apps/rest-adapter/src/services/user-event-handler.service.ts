import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { UserCreatedEvent } from '@libs/users/events/user-created.event';
import { ClientProxy } from '@nestjs/microservices';
import { Inject, Logger } from '@nestjs/common';
import { UsersUpdateService } from '@libs/users/users.update.service';





@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler implements IEventHandler<UserCreatedEvent> {
  private readonly logger = new Logger(UserCreatedHandler.name);
  constructor(@Inject('external-message-bus') private readonly extBusClient: ClientProxy, private readonly userService: UsersUpdateService) { }

  handle(event: UserCreatedEvent) {

    this.userService.upsertUsers([{ ...event }])
    this.extBusClient.emit({ event: 'user-created' }, { ...event })

  }
}