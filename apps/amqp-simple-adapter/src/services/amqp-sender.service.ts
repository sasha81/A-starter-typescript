import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";


@Injectable()
export class AmqpSenderService {

    constructor(@Inject('rabbit-mq-module') private readonly amqpClient: ClientProxy) { }

    sendMessage(pattern: string, message: object): void {
        this.amqpClient.emit(pattern, message)
    }


}