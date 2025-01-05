import { Controller, Logger } from "@nestjs/common";
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from "@nestjs/microservices";
import { ArgumentOutOfRangeError } from "rxjs";
import { AmqpAdapterService } from "../services/amqp-adapter.service";

import { AmqpCreateUserDto, AmqpUpdateUserDto } from "../dto/users-dto";


@Controller()
export class AmqpAdapterController {
  private readonly logger = new Logger(AmqpAdapterController.name);
  constructor(
    private readonly service: AmqpAdapterService
  ) {

  }

  //An example of how an @EventPattern can reply to an event 
  @EventPattern({ cmd: 'create-example-user' })
  async createUser(@Payload() data: AmqpCreateUserDto, @Ctx() context: RmqContext) {

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    this.logger.log(' process  requestdata: ', data)
    this.logger.log('originalMsg', originalMsg)

    const result = await this.service.createUser(data);
    channel.sendToQueue(
      originalMsg.properties.replyTo

      ,
      Buffer.from(
        JSON.stringify({
          data: { ...result },
        })
      ),
      {
        correlationId: originalMsg.properties.correlationId
      }
    )
  }

}