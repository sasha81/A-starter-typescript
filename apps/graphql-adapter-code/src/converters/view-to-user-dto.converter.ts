import { UpdateUserInput } from "../dto/CreateUserInput"
import { UserViewDto } from "../dto/UserWithGroupDto"

export const getUpdateUserDtoFromView = (view:UserViewDto):UpdateUserInput =>{
    return {userId:view.userId, name: view.name, age: view.age}
}