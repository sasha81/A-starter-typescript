import { UserAggregate } from "@libs/users/aggregate/user.aggregate";
import { IUpdateUserDto, IUserDto, IUserDtoWithGroups } from "../ts-rest-contracts/user-contract";
import { UserQueryDto } from "@libs/users/queries/query-dto/read-users.dto";
import { CreateUserCommand } from "@libs/users/commands/create-user.command";
import { UpdateUserCommand } from "@libs/users/commands/update-users.command";


export const getCreateUserCommandFromCreateUserDto = (createUserDto: IUserDto):CreateUserCommand=>{
    return new CreateUserCommand(createUserDto.name, createUserDto.age) 
}

export const getUpdateUserCommandFromUpdateUserDto = (createUserDto: IUpdateUserDto):UpdateUserCommand=>{
    return new UpdateUserCommand(createUserDto.userId,createUserDto.name, createUserDto.age) 
}

export const getUserDtoWithGroupsFromQueryDto = (queryDto:UserQueryDto[]): IUserDtoWithGroups[]=>{
    return queryDto.map(u=>{
        if(u?.groups)  return {...u} 
         else return {...u, groups: []}
    }) as IUserDtoWithGroups[]
}



