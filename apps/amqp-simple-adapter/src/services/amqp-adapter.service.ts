import { GreetQuery } from "@libs/users/queries/greet.query";
import { Injectable, Logger } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";

import { AmqpCreateUserDto, AmqpUpdateUserDto, AmqpUserViewDto } from "../dto/users-dto";
import { CreateUserCommand } from "@libs/users/commands/create-user.command";
import { UpdateUserCommand } from "@libs/users/commands/update-users.command";
import { FindAllUsersQuery } from "@libs/users/queries/find-users.query";
import { getCreateUserCommandFromCreateUserDto, getUpdateUserCommandFromUpdateUserDto } from "../converters/cqrs-user.converter";


@Injectable()
export class AmqpAdapterService {
  private readonly logger = new Logger(AmqpAdapterService.name);
  constructor(

    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus) { }

  async greetUser(name: string): Promise<string> {
    const result = await this.queryBus.execute(new GreetQuery(name));

    return result
  }


  async getAllUsers(): Promise<AmqpUserViewDto[]> {
    //throw new UsersNotFoundException('No users found. Sorry...')
    const users = await this.queryBus.execute(new FindAllUsersQuery()) as AmqpUserViewDto[];

    return users
  }

  async createUser(msg: AmqpCreateUserDto): Promise<AmqpUpdateUserDto> {
    const { name, age } = msg;
    const command = getCreateUserCommandFromCreateUserDto({ name, age })
    const result = await this.commandBus.execute(command);
    this.logger.log('create user command returns: ', result)
    return { ...msg, userId: result }
  }

  async updateUser(msg: AmqpUpdateUserDto): Promise<AmqpUpdateUserDto> {
    const { userId, name, age } = msg;
    const command = getUpdateUserCommandFromUpdateUserDto({ userId, name, age })

    const result = await this.commandBus.execute(new UpdateUserCommand(msg.userId, msg.name, msg.age));
    this.logger.log('update user command returns: ', result)
    return { ...msg, userId: result }
  }


}
