
import { FindAllUsersQuery } from '@libs/users/queries/find-users.query';
import { Injectable, Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserInput, User, UserViewDto } from '../graphql-types/graphql-types';
import { CreateUserCommand } from '@libs/users/commands/create-user.command';
import { UpdateUserCommand } from '@libs/users/commands/update-users.command';
import { UsersNotFoundException } from '@libs/users/exceptions/UserNotFoundException';
import { UserAggregate } from '@libs/users/aggregate/user.aggregate';
import { getCreateUserCommandFromCreateUserDto, getUpdateUserCommandFromUpdateUserDto, getUserDtoFromUserAggregate, getUserDtoWithGroupsFromQueryDto } from '../converters/cqrs-user.converter';

@Injectable()
export class GraphqlAdapterService {
  private readonly logger = new Logger(GraphqlAdapterService.name);
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,) { }


  async getAllUsers(): Promise<UserViewDto[]> {
    //throw new UsersNotFoundException('No users found. Sorry...')
    const users = await this.queryBus.execute(new FindAllUsersQuery());
    const result = getUserDtoWithGroupsFromQueryDto(users)
    return result
  }

  async createUser(msg: CreateUserInput): Promise<User> {
    const { name, age } = msg
    const command = getCreateUserCommandFromCreateUserDto({ name, age })
    const userAggrId = await this.commandBus.execute(command);
    this.logger.log('create user command returns: ', userAggrId)

    return { userId: userAggrId, name, age }
  }

  async updateUser(msg: User): Promise<User> {
    const { userId, name, age } = msg;
    const command = getUpdateUserCommandFromUpdateUserDto({ userId, name, age })
    const userAggrId = await this.commandBus.execute(command);
    this.logger.log('update user command returns: ', userAggrId)

    return { userId: userAggrId, name, age }
  }
}



