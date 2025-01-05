import { Test, TestingModule } from "@nestjs/testing";
import { AmqpAdapterService } from "../services/amqp-adapter.service";
import { AmqpCreateUserDto } from "../dto/users-dto";
import { AmqpAdapterCommandController } from "./amqp-command.controller";

const amqpUserServiceStub: AmqpAdapterService = jest.createMockFromModule("../services/amqp-adapter.service");

describe('AmqpExampleAdapterController', () => {
  let amqpController: AmqpAdapterCommandController;
  const greeting = 'Hello';
  const userId = 'abcd', name = 'Sasha', age = 30;
  const userInput: AmqpCreateUserDto = { name, age }
  const userOutput = { userId, ...userInput }
  beforeAll(() => {
    amqpUserServiceStub.greetUser = jest.fn().mockImplementation(name => {
      return Promise.resolve(greeting + " " + name);
    });
    amqpUserServiceStub.createUser = jest.fn().mockImplementation(({ name, age }) => {
      return Promise.resolve({ userId, name, age });
    })
    amqpUserServiceStub.updateUser = jest.fn().mockImplementation(({ userId, name, age }) => {
      return Promise.resolve({ userId, name, age });
    })
  })
  afterAll(() => {
    jest.clearAllMocks()
  })
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AmqpAdapterCommandController],
      providers: [{
        provide: AmqpAdapterService, useValue: amqpUserServiceStub
      },
      ]
    }).compile();

    amqpController = app.get<AmqpAdapterCommandController>(AmqpAdapterCommandController);
  });
  it('should be defined', () => {
    expect(amqpController).toBeDefined();
  });



  it(`createUser(...) should create a user`, async () => {
    const result = await amqpController.createUser(userInput)
    expect(result).toEqual(userOutput)
  });


  it(`updateUser(...) should update a user`, async () => {
    const result = await amqpController.updateUser(userOutput)
    expect(result).toEqual(userOutput)
  });
});