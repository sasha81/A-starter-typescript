import { ClientProxy } from "@nestjs/microservices";
import { UserCreatedHandler } from "./user-event-handler.service";
import { Test, TestingModule } from "@nestjs/testing";
import { UserCreatedEvent } from "@libs/users/events/user-created.event";
import { UsersUpdateService } from "@libs/users/users.update.service";

describe('UserCreatedHandler', () => {
  let amqpClient: ClientProxy;
  let userService: UsersUpdateService;
  let senderService: UserCreatedHandler;
  beforeAll(async () => {
    jest.useRealTimers()

    amqpClient = jest.createMockFromModule('@nestjs/microservices');
    userService = jest.createMockFromModule("@libs/users/users.update.service");
  })
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({

      providers: [UserCreatedHandler,
        { provide: 'external-message-bus', useValue: amqpClient },
        { provide: UsersUpdateService, useValue: userService }
      ],
    }).compile();

    senderService = module.get<UserCreatedHandler>(UserCreatedHandler);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should be defined', () => {
    expect(senderService).toBeDefined();
  });

  it('should emit a correct pattern and a message ', () => {
    const pattern = { event: 'user-created' }; const event: UserCreatedEvent = {
      userId: "abc",
      name: "ABC",
      age: 18
    }
    const emitMock = jest.fn();
    amqpClient.emit = emitMock;
    const upsertMock = jest.fn();
    userService.upsertUsers = upsertMock
    senderService.handle(event);
    expect(emitMock.mock.calls).toEqual([[pattern, event]])
    expect(upsertMock.mock.calls[0][0]).toEqual([event])

  });


});