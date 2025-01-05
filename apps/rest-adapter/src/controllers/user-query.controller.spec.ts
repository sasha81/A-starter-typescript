import { Test, TestingModule } from '@nestjs/testing';
import { UsersUpdateService } from '@libs/users/users.update.service';
import { Types } from 'mongoose';
import { RestService } from '../services/rest-adapter.service';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { afterEach } from 'node:test';

import { UserQueryDto } from '@libs/users/queries/query-dto/read-users.dto';
import { Group } from '@libs/users/users-mongodb/entities/users-view-mongodb.entity';
import { UserQueryController } from './user-query.controller';
import { IUserDtoWithGroups } from '../ts-rest-contracts/user-contract';




const id = 1, userId = 'ABCD', name = "Sasha", age = 42, groups: Group[] = [{ groupId: 'abc', groupName: 'A', groupStatus: true, userId, userStatus: false }]
const createUserDto = { name, age }
const userQueryDto = new UserQueryDto(userId, name, age, groups)


const helloUserStr: string = "Hello " + name;
const usersQueryResult = [userQueryDto];


describe('UserQueryController', () => {
  let userController: UserQueryController;


  let userService: UsersUpdateService;
  let restService: RestService;
  let queryBus: QueryBus;


  beforeAll(() => {
    userService = jest.createMockFromModule('@libs/users/users.update.service')
    restService = jest.createMockFromModule('../services/rest-adapter.service')
    queryBus = jest.createMockFromModule('@nestjs/cqrs')

  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  beforeEach(async () => {


    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserQueryController],
      providers: [{
        provide: UsersUpdateService, useValue: userService
      },
      {
        provide: RestService, useValue: restService
      },
      {
        provide: QueryBus, useValue: queryBus
      }
      ]

    }).compile();

    userController = app.get<UserQueryController>(UserQueryController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });
  it(`getHello() should return ${helloUserStr}`, async () => {
    queryBus.execute = jest.fn().mockResolvedValue(Promise.resolve(helloUserStr))

    const tsHandler = await userController.getHello();

    expect((await tsHandler({ headers: {}, query: null })).body).toBe(helloUserStr);
  });



  it(`findAllUsers(...) should return all users`, async () => {
    const mockExecute = jest.fn().mockResolvedValue(Promise.resolve(usersQueryResult))
    queryBus.execute = mockExecute
    const tsHandler = await userController.getAll();
    const result = (await tsHandler({ headers: {}, query: { limit: 10 } })).body as IUserDtoWithGroups[];
    console.log('test result', result)
    expect(result[0].userId).toEqual(userId);
    expect(result[0].name).toEqual(name);
    expect(result[0].age).toEqual(age);
    expect(result[0].groups).toEqual(groups);
  });

});
