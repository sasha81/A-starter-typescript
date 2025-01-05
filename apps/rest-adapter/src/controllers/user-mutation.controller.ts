import { Body, Controller, Logger, Post } from '@nestjs/common';
import { UsersUpdateService } from '@libs/users/users.update.service'
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { ICreateUserDto, IUpdateUserDto, userApi } from '../ts-rest-contracts/user-contract'
import { CommandBus } from '@nestjs/cqrs';
import { getCreateUserCommandFromCreateUserDto, getUpdateUserCommandFromUpdateUserDto } from '../converters/cqrs-user.converter';
import { GlobalGroupUpdatedEvent } from '@libs/commons/events/GroupUpdatedEvent';



@Controller()
export class UserMutationController {

  private readonly logger = new Logger(UserMutationController.name); 
  constructor(
    private readonly userService: UsersUpdateService,  
    private readonly commandBus: CommandBus
  ) { }  

  @Post('users/updateGroup')
  async updateGroup(@Body() groupUpdateEvent: GlobalGroupUpdatedEvent){
    return await this.userService.updateGroup(groupUpdateEvent)
  }

  @TsRestHandler(userApi.create)
  async createUser(@Body() createUserDto: ICreateUserDto) {
    return tsRestHandler(userApi.create, async ({ body}) => {
      const {name, age} = body;
  
      const command = getCreateUserCommandFromCreateUserDto({name, age})
      const userAggrId = await this.commandBus.execute(command);
     
      return { status: 200, body: {userId: userAggrId, name, age} };
    });
  }


  @TsRestHandler(userApi.update)
  async updateUser(@Body() createUserDto: IUpdateUserDto) {
    return tsRestHandler(userApi.update, async ({ body}) => {
      const {userId, name, age} = body;

      const command = getUpdateUserCommandFromUpdateUserDto({userId, name, age})
      const userAggrId = await this.commandBus.execute(command );
      return { status: 200, body: {userId: userAggrId,name,age} };
    });
  }

}
