import { TestBed } from '@automock/jest';
import { CreateUserHandler } from './create-user-command.handler';
import { CreateUserCommand } from '../create-user.command';
import { Types } from 'mongoose';
import { EventBus, EventPublisher, IEvent } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { UserAggregateService } from '@libs/users/aggregate/user.aggregate.service';
import { UserCommandMongoDBRepository } from '@libs/users/users-mongodb/repositories/users.command.mongodb.repository';
import { UserAggregate } from '@libs/users/aggregate/user.aggregate';

const id = 1, name = "Sasha", age = 42, userId = 'ABC';
const user = { _id: new Types.ObjectId(id), name, age, userId };
const resultUser = Promise.resolve(user)
const userAggregate = new UserAggregate(userId, name, age);
const resultUserAggregate = Promise.resolve(userAggregate)

describe('CreateUserHandler', () => {
  let createUserHandler: CreateUserHandler;
  let userAggregateService: UserAggregateService;
  let eventBus: EventBus;
  let publisher: EventPublisher;
  let commandRepo: UserCommandMongoDBRepository;


  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(EventPublisher).compile();

    publisher = unit;
    eventBus = unitRef.get(EventBus)
    commandRepo = jest.createMockFromModule('../../users-mongodb/repositories/users.command.mongodb.repository')
    userAggregateService = jest.createMockFromModule('../../aggregate/user.aggregate.service')
  })

  beforeEach(async () => {


    const moduleRef = await Test.createTestingModule({


      providers: [
        { provide: EventBus, useValue: eventBus },

        { provide: EventPublisher, useValue: publisher }
        , CreateUserHandler,

        {
          provide: UserCommandMongoDBRepository,
          useValue: commandRepo

        }
        ,
        {
          provide: UserAggregateService,
          useValue: userAggregateService

        }

      ],
    }).compile();

    createUserHandler = moduleRef.get<CreateUserHandler>(CreateUserHandler);  

  });


  test('should create a user and send an event', async () => {
    const createMock = jest.fn().mockResolvedValue(resultUserAggregate)
    userAggregateService.create = createMock
    const command = new CreateUserCommand(name, age);
    const commandRersult = await createUserHandler.execute(command);

    expect(eventBus.publishAll).toBeCalled()

    expect(commandRersult).toEqual(userAggregate.getId());
  });

});
