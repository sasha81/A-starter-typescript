import { ClientProxy } from "@nestjs/microservices";
import { AmqpSenderService } from "./amqp-sender.service";
import { Test, TestingModule } from "@nestjs/testing";

describe('AmqpSenderService', () => {
  let amqpClient: ClientProxy;

  let senderService: AmqpSenderService;
  beforeAll(async () => {
    jest.useRealTimers()

    amqpClient = jest.createMockFromModule('@nestjs/microservices');
  })
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({

      providers: [AmqpSenderService, { provide: 'rabbit-mq-module', useValue: amqpClient }],
    }).compile();

    senderService = module.get<AmqpSenderService>(AmqpSenderService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should be defined', () => {
    expect(senderService).toBeDefined();
  });

  it('should emit a correct pattern and a message ', () => {
    const pattern = "pattern_A"; const messageObj = { message: "message_A" };
    const emitMock = jest.fn();
    amqpClient.emit = emitMock;
    senderService.sendMessage(pattern, messageObj);
    expect(emitMock.mock.calls).toEqual([[pattern, messageObj]])

  });


});
