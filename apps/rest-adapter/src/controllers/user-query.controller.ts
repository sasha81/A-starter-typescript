import { Body, Controller, Get, Inject, Logger, Post, Req } from '@nestjs/common';

import { UsersUpdateService } from '@libs/users/users.update.service'


import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { ICreateUserDto, IUserDto, IUserDtoWithGroups, TUserDtoWithGroups, userApi } from '../ts-rest-contracts/user-contract'

import { RestService } from '../services/rest-adapter.service';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '@libs/users/commands/create-user.command';
import { GreetQuery } from '@libs/users/queries/greet.query';
import { CreateUserDto } from '@libs/users/commands/command-dto/create-user.dto';
import { getUserDtoWithGroupsFromQueryDto } from '../converters/cqrs-user.converter';
import { UpdateUserCommand } from '@libs/users/commands/update-users.command';
import { GlobalGroupUpdatedEvent } from '@libs/commons/events/GroupUpdatedEvent';
import { FindAllUsersQuery } from '@libs/users/queries/find-users.query';

@Controller()
export class UserQueryController {

  private readonly logger = new Logger(UserQueryController.name);
  constructor(
    private readonly userService: UsersUpdateService,
    private readonly restService: RestService,
    private readonly queryBus: QueryBus
  ) { }

  @Post('users/hello')
  async sayHello(@Body() input: { name: string }) {
    return await this.restService.process(input.name);

  }

  @Post('users/updateGroup')
  async updateGroup(@Body() groupUpdateEvent: GlobalGroupUpdatedEvent) {
    return await this.userService.updateGroup(groupUpdateEvent)
  }


  @TsRestHandler(userApi.getHello)
  getHello() {
    return tsRestHandler(userApi.getHello, async () => {
      const result = await this.queryBus.execute(new GreetQuery(' dear User'));
      return { status: 200, body: result };
    });

  }


  @TsRestHandler(userApi.getAll)
  async getAll() {
    return tsRestHandler(userApi.getAll, async ({ query }) => {
      // this.logger.log('users/all query', query)
      const users = (await this.queryBus.execute(new FindAllUsersQuery())) as TUserDtoWithGroups[];
      const result = getUserDtoWithGroupsFromQueryDto(users)

      return { status: 200, body: result };
    });

  }


}
