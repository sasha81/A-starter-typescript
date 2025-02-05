
import { FindAllUsersQuery } from '@libs/users/queries/find-users.query';
import { Injectable, Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserInput, User, UserView } from '../graphql-types/graphql-types';
import { getCreateUserCommandFromCreateUserDto, getUpdateUserCommandFromUpdateUserDto,  getUserDtoWithGroupsFromQueryDto } from '../converters/cqrs-user.converter';
import { DEFAULT_QUERY_LIMIT } from '@libs/users/config/default-consts';

@Injectable()
export class GraphqlAdapterService {
  private readonly logger = new Logger(GraphqlAdapterService.name);
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,) { }


  async getAllUsers(limit=DEFAULT_QUERY_LIMIT): Promise<UserView[]> {
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



