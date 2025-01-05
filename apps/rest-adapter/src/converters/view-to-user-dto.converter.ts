import { IUpdateUserDto, IUserDtoWithGroups } from "../ts-rest-contracts/user-contract"

export const getUpdateUserDtoFromView = (view:IUserDtoWithGroups):IUpdateUserDto =>{
    return {userId:view.userId, name: view.name, age: view.age}
}