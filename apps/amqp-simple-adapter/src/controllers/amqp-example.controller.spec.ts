import { Test, TestingModule } from "@nestjs/testing";
import { AmqpAdapterController } from "./amqp-example.controller";
import { AmqpAdapterService } from "../services/amqp-adapter.service";
import { AmqpCreateUserDto } from "../dto/users-dto";
import { RmqContext } from "@nestjs/microservices";


const amqpUserServiceStub: AmqpAdapterService = jest.createMockFromModule("../services/amqp-adapter.service");
const contextStub: RmqContext = jest.createMockFromModule("@nestjs/microservices");


describe('AmqpExampleAdapterController', () => {
  let amqpController: AmqpAdapterController;
  //let queryBus=getQueryBusStub(name);
  const greeting = 'Hello';
  const userId = 'abcd', name = 'Sasha', age = 30;
  const userInput = { name, age }
  const userOutput = { userId, ...userInput }
  beforeAll(() => {
    amqpUserServiceStub.greetUser = jest.fn().mockImplementation(name => {
      return Promise.resolve(greeting + " " + name);
    });
    amqpUserServiceStub.createUser = jest.fn().mockImplementation(({ name, age }) => {
      return Promise.resolve({ userId, name, age });
    })

  })
  afterAll(() => {
    jest.clearAllMocks()
  })
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AmqpAdapterController],
      providers: [{
        provide: AmqpAdapterService, useValue: amqpUserServiceStub
      },

      ]

    }).compile();

    amqpController = app.get<AmqpAdapterController>(AmqpAdapterController);
  });
  it('should be defined', () => {
    expect(amqpController).toBeDefined();
  });



  it(`createUser(...) should create a user`, async () => {
    const name = 'ABC'; const age = 18;
    const userDto: AmqpCreateUserDto = {
      name,
      age
    };
    const origMsg = {
      properties: {
        correlationId: '12345',
        replyTo: 'reply_queue'
      }
    }
    const sendToQueueMock = jest.fn()
    contextStub.getChannelRef = jest.fn().mockImplementation(() => {
      return {
        sendToQueue: sendToQueueMock
      }
    })
    contextStub.getMessage = jest.fn().mockImplementation(() => {
      return origMsg
    })

    await amqpController.createUser(userInput, contextStub);

    expect(sendToQueueMock.mock.calls).toEqual([[origMsg.properties.replyTo, Buffer.from(
      JSON.stringify({
        data: { ...userOutput },
      })
    ),
    {
      correlationId: origMsg.properties.correlationId
    }
    ]])
  });

});
