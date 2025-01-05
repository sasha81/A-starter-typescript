import { Injectable, Logger } from "@nestjs/common";
import { UserQueryDto } from "./query-dto/read-users.dto";
import { UserViewMongoDBRepository } from "../users-mongodb/repositories/users.view.mongodb.repository";
import { getQueryDtoFromMongoUser } from "./query-dto/entity-to-querydto.converter";
@Injectable()
export class UserQueryService {
  private readonly logger = new Logger(UserQueryService.name);
  constructor(
    private userQueryMongoDbRepo: UserViewMongoDBRepository) { }

  async findAllUsers(): Promise<UserQueryDto[]> {
    const users = await this.userQueryMongoDbRepo.findAll();

    this.logger.log('findAllUsers users: ', users)
    const usersWithGroupMapToArrayAndNo_id = users.map(getQueryDtoFromMongoUser)

    return usersWithGroupMapToArrayAndNo_id
  }

}