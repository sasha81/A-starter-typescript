import { Test, TestingModule } from "@nestjs/testing";
import { AmqpAdapterController } from "./amqp-example.controller";
import { AmqpAdapterService } from "../services/amqp-adapter.service";
import { AmqpCreateUserDto } from "../dto/users-dto";
import { RmqContext } from "@nestjs/microservices";
import { AmqpAdapterCommandController } from "./amqp-command.controller";
import { AmqpAdapterQueryController } from "./amqp-query.controller";
import { Group } from "@libs/users/users-mongodb/entities/users-view-mongodb.entity";


const amqpUserServiceStub: AmqpAdapterService = jest.createMockFromModule("../services/amqp-adapter.service");



describe('AmqpExampleAdapterController', () => {
  let amqpController: AmqpAdapterQueryController;
  //let queryBus=getQueryBusStub(name);
  const greeting = 'Hello';
  const userId = 'abcd', name = 'Sasha', age = 30;
  const userInput: AmqpCreateUserDto = { name, age }
  const groups: Group[] = [{ groupId: 'abc', groupName: 'A', groupStatus: true, userId, userStatus: false }]
  const userOutput = [{ userId, groups, ...userInput }]

  beforeAll(() => {

    amqpUserServiceStub.getAllUsers = jest.fn().mockImplementation(() => {
      return Promise.resolve(userOutput);
    })
  })
  afterAll(() => {
    jest.clearAllMocks()
  })
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AmqpAdapterQueryController],
      providers: [{
        provide: AmqpAdapterService, useValue: amqpUserServiceStub
      },
      ]
    }).compile();

    amqpController = app.get<AmqpAdapterQueryController>(AmqpAdapterQueryController);
  });
  it('should be defined', () => {
    expect(amqpController).toBeDefined();
  });

  it(`findAllUsers(...) should read all users`, async () => {
    const result = await amqpController.queryAllUser('A')
    expect(result).toEqual(userOutput)
  });


});