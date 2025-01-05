import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';


extendZodWithOpenApi(z);
const c = initContract();

export const errorMessages = {
  name: 'Name shuld be more then 2 chars long',
  age: 'Age 12+'
}
const groupSchema = z.object({
  groupId: z.string().openapi({ description: 'A unique GroupId' }),
  groupName: z.string().openapi({ description: 'group name' }),
  groupStatus: z.boolean().openapi({ description: 'group status (active/incactive)' }),
  userId: z.string().openapi({ description: 'a unique userId - equals that the user' }),
  userStatus: z.boolean().openapi({ description: 'a status of the user in the current group (active/incactive)' }),
})


const userDtoSchema = z.object({
  name: z.string().min(2, errorMessages.name).openapi({ description: 'User name' }),
  age: z.number().min(12, errorMessages.age).openapi({ description: 'User age' })
})
export const createUserDtoSchema = userDtoSchema
const userDtoArraySchema = z.array(userDtoSchema)

export const userWithIdDtoSchema = userDtoSchema.extend({
  userId: z.string().openapi({ description: 'Unique User Id' })
})

const userWithIdAndGroupsDtoSchema = userWithIdDtoSchema.extend({
  groups: z.array(groupSchema)
})

export const userApi = c.router({
  getAll: {
    method: 'GET',
    path: '/users/all',
    query: c.body<{
      limit: number;
    }>(),
    responses: {
      200: z.array(userWithIdAndGroupsDtoSchema)
    }


  },
  getHello: {
    method: 'GET',
    path: '/users/hello',
    query: null,
    responses: {
      200: c.response<string>(),
    },
  },
  create: {
    method: 'POST',
    path: '/users/create',
    query: null,
    body: createUserDtoSchema.openapi({
      title: 'User',
      description: 'A user schema',
    }),
    responses: {
      200: userWithIdDtoSchema,
    },
  }
  ,
  update: {
    method: 'POST',
    path: '/users/update',
    query: null,
    body: userWithIdDtoSchema.openapi({
      title: 'User',
      description: 'A user schema',
    }),
    responses: {
      200: userWithIdDtoSchema,
    },
  }
});

export type TUserDto = z.infer<typeof userDtoSchema>
export type TCreateUserDto = z.infer<typeof createUserDtoSchema>
export type TUpdateUserDto = z.infer<typeof userWithIdDtoSchema>
export type TUserDtoWithGroups = z.infer<typeof userWithIdAndGroupsDtoSchema>
export type TGroup = z.infer<typeof groupSchema>
export interface IUserDto extends TUserDto { }
export interface ICreateUserDto extends TCreateUserDto { }
export interface IUpdateUserDto extends TUpdateUserDto { }
export interface IUserDtoWithGroups extends TUserDtoWithGroups { }
export interface IGroup extends TGroup { }

