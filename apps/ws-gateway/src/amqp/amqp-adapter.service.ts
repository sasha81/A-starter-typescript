import { AmqpConnection, RabbitRPC, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { ConsumeMessage } from 'amqplib';



import * as dotenv from 'dotenv';
import { WsGateway } from '../controllers/ws.gateway';
import { CreateUserDto } from '@libs/users/commands/command-dto/create-user.dto';
import { IMessageDto } from '../zod-schema/message-zod.schema';


(process.env.NODE_ENV!=='prod_ext' ) && dotenv.config({path: `${process.cwd()}/apps/ws-gateway/src/config/env/${process.env.NODE_ENV}.env`})
console.log('serv process.cwd(): ',process.cwd())
console.log(' process.env.AMQP_EXCHANGE: ',process.env.AMQP_EXCHANGE)
@Injectable()
export class AmqpAdapterService {
  private readonly logger = new Logger(AmqpAdapterService.name);
  constructor(   
    private readonly wsGateway: WsGateway 
   ){}
  
   
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
        routingKey: process.env.AMQP_OUT_ROUTINGKEY,
        queue: process.env.AMQP_OUT_QUEUE,      
        queueOptions:{
            durable: true
        }
      })
      public async pubSubHandler(message: IMessageDto, amqpMsg: ConsumeMessage) {
        this.logger.log(`Received pub/sub message: ${JSON.stringify(message)} and ${JSON.stringify(amqpMsg)}`);
        this.wsGateway.sendMessageToWS({...message})
      
      }

}
