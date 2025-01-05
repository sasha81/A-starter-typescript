import { Test, TestingModule } from "@nestjs/testing";
import { RmqContext } from "@nestjs/microservices";
import { AmqpAdapterGlobalEventController } from "./amqp-global-event.controller";
import { UsersUpdateService } from "@libs/users/users.update.service";
import { GlobalGroupUpdatedEvent } from "@libs/commons/events/GroupUpdatedEvent";


const amqpUserServiceStub: UsersUpdateService = jest.createMockFromModule("@libs/users/users.update.service");
const contextStub: RmqContext = jest.createMockFromModule("@nestjs/microservices");

const groupUpdateEvent: GlobalGroupUpdatedEvent = { groupId: 'abc', groupName: 'A', groupStatus: true, userIds: [{ userId: 'ABC', userStatus: true }] };
describe('AmqpSimpleAdapterController', () => {
  let amqpController: AmqpAdapterGlobalEventController;


  beforeAll(() => {
    amqpUserServiceStub.updateGroup = jest.fn().mockImplementation((groupUpdateEvent: GlobalGroupUpdatedEvent) => { })
  })
  afterAll(() => {
    jest.clearAllMocks()
  })
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AmqpAdapterGlobalEventController],
      providers: [{
        provide: UsersUpdateService, useValue: amqpUserServiceStub
      },
      ]
    }).compile();

    amqpController = app.get<AmqpAdapterGlobalEventController>(AmqpAdapterGlobalEventController);
  });
  it('should be defined', () => {
    expect(amqpController).toBeDefined();
  });

  it(`updateGroup(...) should call an updare service`, async () => {
    const mockUpdate = jest.fn().mockImplementation((groupUpdateEvent: GlobalGroupUpdatedEvent) => { })
    amqpUserServiceStub.updateGroup = mockUpdate
    await amqpController.groupUpdated(groupUpdateEvent);
    expect(mockUpdate.mock.calls[0][0]).toEqual(groupUpdateEvent)
  });

});
