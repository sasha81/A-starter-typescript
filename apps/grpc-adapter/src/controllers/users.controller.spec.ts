import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { CreateUserDto, User } from '../from-proto/users';
import { NotFoundException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Group } from '@libs/users/users-mongodb/entities/users-view-mongodb.entity';
import { UserQueryDto } from '@libs/users/queries/query-dto/read-users.dto';


const userDto1: CreateUserDto = {
  username: 'A',
  userage: 10
};
const userDto2: CreateUserDto = {
  username: 'B',
  userage: 20
};

const user2: User = {
  userId: 'b',
  ...userDto2
}

const user1: User = {
  userId: 'a',
  ...userDto1
}
const userId = 'ABCD', name = "Sasha", age = 42, groups: Group[] = [{ groupId: 'abc', groupName: 'A', groupStatus: true, userId, userStatus: false }]

const userQueryDto = new UserQueryDto(userId, name, age, groups)
const usersQueryResult = [userQueryDto];
describe('UserMutationController', () => {
  let userController: UsersController;


  let queryBus: QueryBus;


  let commandBus: CommandBus;

  beforeAll(() => {


    commandBus = jest.createMockFromModule('@nestjs/cqrs')
    queryBus = jest.createMockFromModule('@nestjs/cqrs')
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  beforeEach(async () => {


    const app: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: CommandBus, useValue: commandBus },
        { provide: QueryBus, useValue: queryBus },
      ]

    }).compile();

    userController = app.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });


  it(`createUser(...) should create a user`, async () => {
    const executeMock = jest.fn().mockResolvedValue(Promise.resolve(user1.userId))
    commandBus.execute = executeMock
    const result = await userController.createUser(userDto1);
    expect(result).toEqual(user1);
    expect(executeMock).toBeCalled()
  });

  it(`updateUser(...) should create a user`, async () => {
    const executeMock = jest.fn().mockResolvedValue(Promise.resolve(user1.userId))
    commandBus.execute = executeMock
    const result = await userController.updateUser(user1);
    expect(result).toEqual(user1);
    expect(executeMock).toBeCalled()
  });

  it(`findAllUsers(...) should return users`, async () => {
    const mockExecute = jest.fn().mockResolvedValue(Promise.resolve(usersQueryResult))
    queryBus.execute = mockExecute
    const result = await userController.findAllUsers({});
    expect(result.usersWithGroups[0].groups[0].groupId).toEqual(groups[0].groupId);
    expect(result.usersWithGroups[0].groups[0].groupname).toEqual(groups[0].groupName);
    expect(result.usersWithGroups[0].groups[0].groupstatus).toEqual(groups[0].groupStatus);
    expect(result.usersWithGroups[0].userId).toEqual(userId);
    expect(result.usersWithGroups[0].username).toEqual(name);
    expect(result.usersWithGroups[0].userage).toEqual(age);
    expect(mockExecute).toBeCalled()
  });

});
