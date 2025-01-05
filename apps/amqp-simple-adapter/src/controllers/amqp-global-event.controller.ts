


import { Controller, Logger } from "@nestjs/common";
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from "@nestjs/microservices";
import { ArgumentOutOfRangeError } from "rxjs";
import { AmqpAdapterService } from "../services/amqp-adapter.service";

import { AmqpCreateUserDto, AmqpUpdateUserDto } from "../dto/users-dto";
import { UserCreatedEvent } from "@libs/users/events/user-created.event";
import { GlobalGroupUpdatedEvent } from "@libs/commons/events/GroupUpdatedEvent";
import { UsersUpdateService } from "@libs/users/users.update.service";


@Controller()
export class AmqpAdapterGlobalEventController {
  private readonly logger = new Logger(AmqpAdapterGlobalEventController.name);
  constructor(
     private readonly userService: UsersUpdateService
  ) {}
  
  @EventPattern({ event: 'group-updated' })
  async groupUpdated(@Payload() input: GlobalGroupUpdatedEvent) {   
    this.userService.updateGroup(input)
    this.logger.log(`the event ${JSON.stringify(input)} is received and processed`);
  }
}