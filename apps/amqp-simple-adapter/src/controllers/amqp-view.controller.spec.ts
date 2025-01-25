import { Test, TestingModule } from "@nestjs/testing";
import { AmqpAdapterService } from "../services/amqp-adapter.service";
import { AmqpCreateUserDto } from "../dto/users-dto";
import { AmqpAdapterViewController } from "./amqp-view.controller";
import { Group } from "@libs/users/users-mongodb/entities/users-view-mongodb.entity";
import { UsersUpdateService } from "@libs/users/users.update.service";
import { GlobalGroupUpdatedEvent } from "@libs/commons/events/GroupUpdatedEvent";

const amqpUserServiceStub: AmqpAdapterService = jest.createMockFromModule("../services/amqp-adapter.service");

describe('AmqpExampleAdapterController', () => {
  let amqpController: AmqpAdapterViewController;
  let userService: UsersUpdateService;
  
  const userId = 'abcd', name = 'Sasha', age = 30;
  const userInput: AmqpCreateUserDto = { name, age }
  const groups: Group[] = [{ groupId: 'abc', groupName: 'A', groupStatus: true, userId, userStatus: false }]
  const userOutput = [{ userId, groups, ...userInput }]

  beforeAll(() => {
    amqpUserServiceStub.getAllUsers = jest.fn().mockImplementation(() => {
      return Promise.resolve(userOutput);
    })
    userService = jest.createMockFromModule("@libs/users/users.update.service");
  })
  afterAll(() => {
    jest.clearAllMocks()
  })
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AmqpAdapterViewController],
      providers: [{
        provide: AmqpAdapterService, useValue: amqpUserServiceStub,
       
      },{ provide: UsersUpdateService, useValue:  userService }
      ]
    }).compile();

    amqpController = app.get<AmqpAdapterViewController>(AmqpAdapterViewController);
  });
  it('should be defined', () => {
    expect(amqpController).toBeDefined();
  });

  it(`findAllUsers(...) should read all users`, async () => {
    const result = await amqpController.queryAllUser('A')
    expect(result).toEqual(userOutput)
  });

  it(`groupUpdated(...) should update all appropriate users`, async () => {
    const groupUpdatedEvent:GlobalGroupUpdatedEvent = {
      groupId: "123",
      groupName: "ABC",
      groupStatus: true,
      userIds: [{userId:'1', userStatus:true},{userId:'1', userStatus:false}]      
    }
    userService.updateGroup = jest.fn().mockImplementation(event=>{
      expect(event.groupId).toEqual(groupUpdatedEvent.groupId);
      expect(event.groupName).toEqual(groupUpdatedEvent.groupName);     
      expect(event.userIds).toEqual(groupUpdatedEvent.userIds);

    })
    await amqpController.groupUpdated(groupUpdatedEvent)
   
  });
});