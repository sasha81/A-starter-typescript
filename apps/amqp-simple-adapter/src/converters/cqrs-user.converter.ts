import { CreateUserCommand } from "@libs/users/commands/create-user.command"
import { UpdateUserCommand } from "@libs/users/commands/update-users.command"
import { AmqpCreateUserDto, AmqpUpdateUserDto, AmqpUserViewDto } from "../dto/users-dto"
import { UserQueryDto } from "@libs/users/queries/query-dto/read-users.dto"




export const getCreateUserCommandFromCreateUserDto = (createUserDto: AmqpCreateUserDto):CreateUserCommand=>{
    return new CreateUserCommand(createUserDto.name, createUserDto.age) 
}

export const getUpdateUserCommandFromUpdateUserDto = (createUserDto: AmqpUpdateUserDto):UpdateUserCommand=>{
    return new UpdateUserCommand(createUserDto.userId,createUserDto.name, createUserDto.age) 
}

export const getUserDtoWithGroupsFromQueryDto = (queryDto:UserQueryDto[]): AmqpUserViewDto[]=>{
    return queryDto.map(u=>{
        if(u?.groups)  return {...u} 
         else return {...u, groups: []}
    }) as AmqpUserViewDto[]
}
export const getUpdateUserDtoFromView = (view:UserQueryDto):AmqpUpdateUserDto =>{
    return {userId:view.userId, name: view.name, age: view.age}
}
