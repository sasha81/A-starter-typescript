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
export class UsersQueryResolver {
    private readonly logger = new Logger(UsersQueryResolver.name);
    constructor(private graphqlAdapterService: GraphqlAdapterService) { }

    @Query((returns) => [UserViewDto])
    async getAllUsers(): Promise<UserViewDto[]> {
        return await this.graphqlAdapterService.getAllUsers() as UserViewDto[];
    }
}