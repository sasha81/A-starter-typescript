import { Injectable, Logger } from '@nestjs/common';
import { UpdateUserDto } from './commands/command-dto/update-user.dto';
import { UserViewMongoDBRepository } from './users-mongodb/repositories/users.view.mongodb.repository';
import { GlobalGroupUpdatedEvent as GroupUpdatedEvent } from '@libs/commons/events/GroupUpdatedEvent';
import { IMongoUser } from './users-mongodb/entities/users-mongodb.entity';


@Injectable()
export class UsersUpdateService {
  private readonly logger = new Logger(UsersUpdateService.name);
  constructor(
    private userQueryMongoDbRepo: UserViewMongoDBRepository) { }

  async findAllUsers() {
    const users = await this.userQueryMongoDbRepo.findAll();
    this.logger.log('findAllUsers users: ', users)
    const usersWithGroupMapToArrayAndNo_id = users
      .map((uv) => {


        return {
          userId: uv.userId,
          name: uv.name,
          age: uv.age,
          groups: uv.groups ? Array.from(uv.groups, ([_, val]) => ({ ...val })) : []
        }
      })


    return usersWithGroupMapToArrayAndNo_id
  }


  async upsertUsers(userDtoArray: UpdateUserDto[]): Promise<void> {
    const updateUserArr = userDtoArray.map(user => ({ ...user } as IMongoUser))
    await this.userQueryMongoDbRepo.upsertUsers(updateUserArr)
  }

  async updateGroup(groupUpdateEvent: GroupUpdatedEvent) {
    const { userIds, ...rest } = groupUpdateEvent
    const updateUserArr = groupUpdateEvent.userIds.map(u => ({
      ...u, ...rest
    }));
    await this.userQueryMongoDbRepo.upsertUserGroup(updateUserArr)
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
