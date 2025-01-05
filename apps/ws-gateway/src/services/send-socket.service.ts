import { Injectable } from "@nestjs/common";
import { WsGateway } from "../controllers/ws.gateway";
import { IErrorMessageDto, IMessageDto } from "../zod-schema/message-zod.schema";



@Injectable()
export class SendSocketService{
    constructor(private readonly wsGateway: WsGateway ){}

    send(message:IMessageDto|IErrorMessageDto){
        this.wsGateway.sendMessageToWS({...message})
    }
}