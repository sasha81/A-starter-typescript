import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GraphqlAdapterService } from "../services/graphql-adapter.service";
import { CreateUserInput, UpdateUserInput, User, UserViewDto, UserId } from "../graphql-types/graphql-types";
import { Logger } from "@nestjs/common";



//postman URI: http://localhost:process.env.PORT/graphql
@Resolver()
export class UsersQueryResolver {
    private readonly logger = new Logger(UsersQueryResolver.name); 
    constructor(private graphqlAdapterService: GraphqlAdapterService){}

    @Query()    
    async getAllUsers():Promise<UserViewDto[]>{
        return await this.graphqlAdapterService.getAllUsers() as UserViewDto[];
    }
}