import { z } from 'zod';
import { toZod } from "tozod";
import { CreateUserInput } from '../dto/CreateUserInput';
import { User } from '../model/User';
import { UserViewDto } from '../dto/UserWithGroupDto';


export const errorMessages = {
  name: 'Name shuld be more then 2 chars long',
  age: 'Age 12+'
}
const groupSchema = z.object({
  groupId: z.string(),
  groupName: z.string(),
  groupStatus: z.boolean(),
  userId: z.string(),
  userStatus: z.boolean()
})
const userDtoObject = {
  name: z.string().min(2, errorMessages.name),
  age: z.number().min(12, errorMessages.age)
}

export const userWithIdDtoSchema = z.object(userDtoObject).extend({
  userId: z.string()
})
export const userWithIdAndGroupDtoSchema = userWithIdDtoSchema.extend({
  groups: z.array(groupSchema)
})
export const createUserDtoSchema: toZod<CreateUserInput> = z.object(userDtoObject)
export const userDtoSchema: toZod<User> = userWithIdDtoSchema
export const userWithGroupDto: toZod<UserViewDto> = userWithIdAndGroupDtoSchema







