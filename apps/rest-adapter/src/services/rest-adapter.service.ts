

import { UsersUpdateService } from "@libs/users/users.update.service";
import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

//An auxilary ervice to send greet messages via a rabbit-mq bus
@Injectable()
export class RestService {
    constructor(
        private readonly userService: UsersUpdateService,
        @Inject('external-message-bus') private readonly amqpClient: ClientProxy
    ) { }


    async process(name: string) {

        const result = await this.amqpClient.send({ cmd: 'greet' }, name);

        return result
    }

}

