import { UserAggregate } from "@libs/users/aggregate/user.aggregate";

import { UserQueryDto } from "@libs/users/queries/query-dto/read-users.dto";
import { CreateUserCommand } from "@libs/users/commands/create-user.command";
import { UpdateUserCommand } from "@libs/users/commands/update-users.command";
import { CreateUserInput, UpdateUserInput, User, UserView } from "../graphql-types/graphql-types";


export const getUserDtoFromUserAggregate = (userAggregate: UserAggregate): UpdateUserInput => {
    return { userId: userAggregate.getId(), name: userAggregate.getName(), age: userAggregate.getAge() }
}


export const getCreateUserCommandFromCreateUserDto = (createUserDto: CreateUserInput): CreateUserCommand => {
    return new CreateUserCommand(createUserDto.name, createUserDto.age)
}

export const getUpdateUserCommandFromUpdateUserDto = (createUserDto: UpdateUserInput): UpdateUserCommand => {
    return new UpdateUserCommand(createUserDto.userId, createUserDto.name, createUserDto.age)
}

export const getUserDtoWithGroupsFromQueryDto = (queryDto: UserQueryDto[]): UserView[] => {
    return queryDto.map(u => {
        if (u?.groups) return { ...u }
        else return { ...u, groups: [] }
    }) as UserView[]
}

export const getUpdateUserDtoFromView = (view: UserView): User => {
    return { userId: view.userId, name: view.name ? view.name : '', age: view.age ? view.age : 0 }
}

