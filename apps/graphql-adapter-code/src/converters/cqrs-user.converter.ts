import { UserQueryDto } from "@libs/users/queries/query-dto/read-users.dto";
import { CreateUserCommand } from "@libs/users/commands/create-user.command";
import { UpdateUserCommand } from "@libs/users/commands/update-users.command";
import { CreateUserInput, UpdateUserInput } from "../dto/CreateUserInput";
import { UserViewDto } from "../dto/UserWithGroupDto";


export const getCreateUserCommandFromCreateUserDto = (createUserDto: CreateUserInput): CreateUserCommand => {
    return new CreateUserCommand(createUserDto.name, createUserDto.age)
}

export const getUpdateUserCommandFromUpdateUserDto = (createUserDto: UpdateUserInput): UpdateUserCommand => {
    return new UpdateUserCommand(createUserDto.userId, createUserDto.name, createUserDto.age)
}

export const getUserDtoWithGroupsFromQueryDto = (queryDto: UserQueryDto[]): UserViewDto[] => {
    return queryDto.map(u => {
        if (u?.groups) return { ...u }
        else return { ...u, groups: [] }
    }) as UserViewDto[]
}

