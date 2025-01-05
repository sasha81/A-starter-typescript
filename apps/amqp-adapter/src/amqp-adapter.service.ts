import { AmqpConnection, RabbitRPC, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { ConsumeMessage } from 'amqplib';
import { CreateUserDto } from '@libs/users/commands/command-dto/create-user.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import * as dotenv from 'dotenv';
import { CreateUserCommand } from '@libs/users/commands/create-user.command';

(process.env.NODE_ENV !== 'prod_ext') && dotenv.config({ path: `${process.cwd()}/apps/amqp-adapter/src/config/env/${process.env.NODE_ENV}.env` })
console.log('serv process.cwd(): ', process.cwd())
console.log(' process.env.AMQP_EXCHANGE: ', process.env.AMQP_EXCHANGE)
@Injectable()
export class AmqpAdapterService {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,) { }


  // @RabbitRPC({   
  //   exchange: process.env.AMQP_EXCHANGE,
  //   routingKey: process.env.AMQP_ROUTINGKEY,
  //   queue: process.env.AMQP_QUEUE,
  //   queueOptions:{
  //       durable: true
  //   }
  // })
  //   public async rpcHandler(msg: {}, amqpMsg: ConsumeMessage) {

  //     console.log('amqpMsg: ',amqpMsg);
  //     console.log(`Correlation id: ${amqpMsg.properties.correlationId}`);
  //     const utf8EncodeText = new TextEncoder();
  //     const str = "{\"name\":\"Nest\"}";
  //     const byteArray = utf8EncodeText.encode(str);
  //     return byteArray;

  //   }

  @RabbitSubscribe({
    exchange: process.env.AMQP_EXCHANGE,
    routingKey: process.env.AMQP_ROUTINGKEY,
    queue: process.env.AMQP_QUEUE,
    queueOptions: {
      durable: true
    }
  })
  public async pubSubHandler(msg: CreateUserDto, amqpMsg: ConsumeMessage) {
    console.log(`Received pub/sub message: ${JSON.stringify(msg)} and ${JSON.stringify(amqpMsg)}`);
    //  this.commandBus.execute(new CreateUserCommand(msg.name, msg.age))
    // this.userService.create({name: msg.name, age: msg.age });
    // this.amqpConnection.publish(
    //   process.env.AMQP_EXCHANGE ? process.env.AMQP_EXCHANGE  : 'aux_exchange', `${process.env.AMQP_ROUTINGKEY}-reply`,
    //    { msg: 'hello from nest pub sub!'})
  }

}
