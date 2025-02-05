import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GraphqlAdapterService } from "../services/graphql-adapter.service";
import { CreateUserInput, UpdateUserInput, User, UserView, UserId } from "../graphql-types/graphql-types";
import { Logger } from "@nestjs/common";



//postman URI: http://localhost:process.env.PORT/graphql
@Resolver()
export class UsersQueryResolver {
    private readonly logger = new Logger(UsersQueryResolver.name); 
    constructor(private graphqlAdapterService: GraphqlAdapterService){}

    @Query()    
    async getAllUsers(@Args('limit') limit: number):Promise<UserView[]>{
        return await this.graphqlAdapterService.getAllUsers(limit) as UserView[];
    }
}