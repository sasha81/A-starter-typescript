import { Controller, Logger, NotFoundException } from '@nestjs/common';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { CreateUserDto, Empty, User, UsersServiceController, UsersServiceControllerMethods, UsersWithGroupsDto } from '../from-proto/users';
import { CreateUserCommand } from '@libs/users/commands/create-user.command';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { convertUserViewToGRPCDto } from '../converters/view-dto.converter';
import { FindAllUsersQuery } from '@libs/users/queries/find-users.query';
import { UpdateUserCommand } from '@libs/users/commands/update-users.command';

@Controller()
@UsersServiceControllerMethods()
export class UsersController implements UsersServiceController{

  private readonly logger = new Logger(UsersController.name); 
  constructor( private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus) {}


  async createUser(createUserDto: CreateUserDto):   Promise<User> {
    const {username, userage} = createUserDto;
    const result  = await this.commandBus.execute(new CreateUserCommand(username, userage))
    return {userId:result,username, userage}
  }

  @GrpcMethod()
  async findAllUsers(request: Empty): Promise<UsersWithGroupsDto>  {
    const users= await  this.queryBus.execute(new FindAllUsersQuery());
    const result = await convertUserViewToGRPCDto(users)
    return Promise.resolve(result)

  }

  async updateUser(request: User):  Promise<User> {
    const {userId, username, userage} = request;
    const result  = await this.commandBus.execute(new UpdateUserCommand(userId,username, userage))
    return {userId:result,username, userage}
}

}
