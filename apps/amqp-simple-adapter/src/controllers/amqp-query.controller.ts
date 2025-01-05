import { Controller, Logger } from "@nestjs/common";
import {  MessagePattern, Payload } from "@nestjs/microservices";
import { ArgumentOutOfRangeError } from "rxjs";
import { AmqpAdapterService } from "../services/amqp-adapter.service";

import {  AmqpUserViewDto } from "../dto/users-dto";



@Controller()
export class AmqpAdapterQueryController {
  private readonly logger = new Logger(AmqpAdapterQueryController.name);
  constructor(
    private readonly service: AmqpAdapterService
  ) {}
  
  @MessagePattern({ query: 'find-all-users' })
  async queryAllUser(@Payload() data: string): Promise<AmqpUserViewDto[]> {
    
    // throw new ArgumentOutOfRangeError();
    const result = await this.service.getAllUsers()
    this.logger.log('find-all-users   response: ', result);
    return result
  }

  }