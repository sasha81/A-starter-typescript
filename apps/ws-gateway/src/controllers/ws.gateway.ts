import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import {Injectable, Logger, UseFilters, UsePipes} from '@nestjs/common';

import { WebSocketGateway, OnGatewayConnection, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SocketService } from '../services/socket.service';
import * as dotenv from 'dotenv';
import { DEFAULT_WS_PORT, DEFAULT_WS_TOPIC } from '../config/default-consts';
import { ZodValidationPipe } from 'nestjs-zod';
import { IMessageDto, messageDtoSchema } from '../zod-schema/message-zod.schema';
import { ZodValidationExceptionFilter } from '../filter/zod-filter';
import { v4 as uuid } from 'uuid';

(process.env.NODE_ENV!=='prod_ext' ) && dotenv.config({path: `${process.cwd()}/apps/ws-gateway/src/config/env/${process.env.NODE_ENV}.env`})

@Injectable()
@WebSocketGateway(parseInt(process.env.WS_PORT?process.env.WS_PORT:DEFAULT_WS_PORT,10)
,{cors:'*'})
export class WsGateway implements OnGatewayConnection{
  private readonly logger = new Logger(WsGateway.name);
  constructor(
    private readonly socketService: SocketService,
    private readonly amqpConnection: AmqpConnection
    ){}

  @WebSocketServer()
  private server: Socket;

  getServer():Socket{
    return this.server;
  }
  setServer(server: Socket):void{
    this.server = server;
  }

  handleConnection(socket: Socket): void {
    this.socketService.handleConnection(socket);
  }

  @UseFilters(ZodValidationExceptionFilter)
  @SubscribeMessage(process.env.WS_TOPIC)
  @UsePipes(new ZodValidationPipe(messageDtoSchema))
  handleMessage(@MessageBody() message: IMessageDto): void {
    this.logger.log('topic: ', process.env.WS_TOPIC)
    this.logger.log('ws receives message', message)

    // this.amqpConnection.publish(process.env.AMQP_EXCHANGE ? process.env.AMQP_EXCHANGE  : 'aux_exchange',
    //  process.env.AMQP_IN_ROUTINGKEY? process.env.AMQP_IN_ROUTINGKEY: 'ws-in-routingkey', { ...message})
   Math.random()<0.5 ? this.sendMessageToWS(message) : this.sendMessageToWS({...message,userId:uuid()})
  }


  sendMessageToWS(message: IMessageDto): void {
    this.server.emit(process.env.WS_TOPIC ? process.env.WS_TOPIC: DEFAULT_WS_TOPIC,{...message});
  }


}
