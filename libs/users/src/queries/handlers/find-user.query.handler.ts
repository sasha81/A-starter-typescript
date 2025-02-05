import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindAllUsersQuery } from "../find-users.query";
import { UserQueryDto } from "../query-dto/read-users.dto";
import { UserQueryService } from "../user.query.service";

@QueryHandler(FindAllUsersQuery)
export class UserQueryHandler implements IQueryHandler<FindAllUsersQuery> {
  constructor(
    private userQueryService: UserQueryService,
  ) { }
  async execute(query: FindAllUsersQuery): Promise<UserQueryDto[]> {
    const userDtos = (await this.userQueryService.findAllUsers(query.lim)) as UserQueryDto[];

    return userDtos;
  }
}