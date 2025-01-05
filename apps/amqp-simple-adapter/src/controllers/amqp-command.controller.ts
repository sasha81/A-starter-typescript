import { Controller, Logger } from "@nestjs/common";
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from "@nestjs/microservices";


import { AmqpCreateUserDto, AmqpUpdateUserDto } from "../dto/users-dto";
import { AmqpAdapterService } from "../services/amqp-adapter.service";



@Controller()
export class AmqpAdapterCommandController {
  private readonly logger = new Logger(AmqpAdapterCommandController.name);
  constructor(
    private readonly service: AmqpAdapterService
  ) {

  }
  @MessagePattern({ cmd: 'greet' })
  async greet(@Payload() data: string) {
    this.logger.log('get-greet   requestdata: ', data);
    // throw new ArgumentOutOfRangeError();
    const result = await this.service.greetUser(data)
    this.logger.log('get-greet   response: ', result);
    return result
  }
  @MessagePattern({ cmd: 'update-user' })
  async updateUser(@Payload() input: AmqpUpdateUserDto) {

    // throw new ArgumentOutOfRangeError();
    const result = await this.service.updateUser(input)
    this.logger.log('get-greet   response: ', result);
    return result
  }
  @MessagePattern({ cmd: 'create-user' })
  async createUser(@Payload() input: AmqpCreateUserDto) {

    // throw new ArgumentOutOfRangeError();
    const result = await this.service.createUser(input)
    this.logger.log('get-greet   response: ', result);
    return result
  }
}