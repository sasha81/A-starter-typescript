import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GraphqlAdapterService } from "../services/graphql-adapter.service";
import { CreateUserInput, UpdateUserInput, UserId } from "../dto/CreateUserInput";
import { User } from "../model/User";
import { Logger, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "nestjs-zod";
import { createUserDtoSchema, userDtoSchema } from "../zod-schema/user-zod.schema";
import { UserViewDto } from "../dto/UserWithGroupDto";



//postman URI: http://localhost:process.env.PORT/graphql
@Resolver()
export class UsersMutationResolver {
    private readonly logger = new Logger(UsersMutationResolver.name);
    constructor(private graphqlAdapterService: GraphqlAdapterService) { }



    @Mutation((returns) => User)
    // @UsePipes(new ZodValidationPipe(createUserDtoSchema))
    async createUser(@Args('input') input: CreateUserInput): Promise<User> {
        this.logger.log('create user input: ', input)
        const result = await this.graphqlAdapterService.createUser(input);
        return { ...result }
    }


    @Mutation((returns) => User)
    // @UsePipes(new ZodValidationPipe(userDtoSchema))
    async updateUser(@Args('input') input: UpdateUserInput): Promise<User> {
        this.logger.log('create user input: ', input)
        const result = await this.graphqlAdapterService.updateUser(input);
        return { ...result }
    }

}