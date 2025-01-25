import { Controller, Logger } from "@nestjs/common";
import {  EventPattern, MessagePattern, Payload } from "@nestjs/microservices";
import { AmqpAdapterService } from "../services/amqp-adapter.service";
import { GlobalGroupUpdatedEvent } from '@libs/commons/events/GroupUpdatedEvent';
import {  AmqpUserViewDto } from "../dto/users-dto";
import { UsersUpdateService } from '@libs/users/users.update.service'



@Controller()
export class AmqpAdapterQueryController {
  private readonly logger = new Logger(AmqpAdapterQueryController.name);
  constructor(
    private readonly userService: UsersUpdateService,
    private readonly service: AmqpAdapterService
  ) {}
  
    @MessagePattern({ query: 'find-all-users' })
    async queryAllUser(@Payload() data: string): Promise<AmqpUserViewDto[]> {
      
      // throw new ArgumentOutOfRangeError();
      const result = await this.service.getAllUsers()
      this.logger.log('find-all-users   response: ', result);
      return result
    }

    @EventPattern({event: 'group-updated'})
    async groupUpdated(@Payload() groupUpdateEvent: GlobalGroupUpdatedEvent): Promise<void>{
      this.logger.log('group-updated event: ',groupUpdateEvent)
      await this.userService.updateGroup(groupUpdateEvent)
    }
  }