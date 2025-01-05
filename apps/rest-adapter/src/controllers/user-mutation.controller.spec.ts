import { Test, TestingModule } from '@nestjs/testing';
import { UsersUpdateService } from '@libs/users/users.update.service';
import { Types } from 'mongoose';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { afterEach } from 'node:test';
import { UserQueryDto } from '@libs/users/queries/query-dto/read-users.dto';
import { Group } from '@libs/users/users-mongodb/entities/users-view-mongodb.entity';
import { UserMutationController } from './user-mutation.controller';




const id = 1, name = "Sasha", age = 42, groups: Group[] = [{ groupId: 'abc', groupName: 'A', groupStatus: true, userId: id.toString(), userStatus: false }]
const createUserDto = { name, age }
const createdUser = { userId: id.toString(), name, age }
const userQueryDto = new UserQueryDto(id.toString(), name, age, groups)
const user = { _id: new Types.ObjectId(id), ...userQueryDto };

const helloUserStr: string = "Hello " + name;
const usersQuery = [userQueryDto];
const users = [user];

describe('UserMutationController', () => {
  let userController: UserMutationController;


  let userService: UsersUpdateService;


  let commandBus: CommandBus;

  beforeAll(() => {
    userService = jest.createMockFromModule('@libs/users/users.update.service')

    commandBus = jest.createMockFromModule('@nestjs/cqrs')
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  beforeEach(async () => {


    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserMutationController],
      providers: [{
        provide: UsersUpdateService, useValue: userService
      },
      {
        provide: CommandBus, useValue: commandBus
      },
      ]

    }).compile();

    userController = app.get<UserMutationController>(UserMutationController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });


  it(`createUser(...) should create a user`, async () => {
    const excuteMock = jest.fn().mockResolvedValue(Promise.resolve(id.toString()))
    commandBus.execute = excuteMock
    const tsHandler = await userController.createUser(createUserDto);

    expect((await tsHandler({ headers: {}, query: null, body: createUserDto })).body).toEqual(createdUser);
  });

  it(`updateUser(...) should create a user`, async () => {
    const excuteMock = jest.fn().mockResolvedValue(Promise.resolve(id.toString()))
    commandBus.execute = excuteMock
    const tsHandler = await userController.updateUser(createdUser);

    expect((await tsHandler({ headers: {}, query: null, body: createdUser })).body).toEqual(createdUser);
  });

});
