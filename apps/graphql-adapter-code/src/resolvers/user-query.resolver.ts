import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GraphqlAdapterService } from "../services/graphql-adapter.service";
import { Logger } from "@nestjs/common";
import { UserViewDto } from "../dto/UserWithGroupDto";

//postman URI: http://localhost:process.env.PORT/graphql
@Resolver()
export class UsersQueryResolver {
    private readonly logger = new Logger(UsersQueryResolver.name);
    constructor(private graphqlAdapterService: GraphqlAdapterService) { }

    @Query((returns) => [UserViewDto])
    async getAllUsers(@Args('limit', {type: ()=> Int}) limit: number): Promise<UserViewDto[]> {
        return await this.graphqlAdapterService.getAllUsers(limit) as UserViewDto[];
    }
}