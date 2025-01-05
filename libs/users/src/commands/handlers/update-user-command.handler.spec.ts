import { TestBed } from '@automock/jest';
import { Types } from 'mongoose';
import { EventBus, EventPublisher } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { UserAggregateService } from '@libs/users/aggregate/user.aggregate.service';
import { UserCommandMongoDBRepository } from '@libs/users/users-mongodb/repositories/users.command.mongodb.repository';
import { UserAggregate } from '@libs/users/aggregate/user.aggregate';
import { UpdateUserCommandHandler } from './update-users-command.handler';
import { UpdateUserCommand } from '../update-users.command';

const id = 1, name = "Sasha", age = 42, userId = 'ABC';
const user = { _id: new Types.ObjectId(id), name, age, userId };
const resultUser = Promise.resolve(user)
const userAggregate = new UserAggregate(userId, name, age);
const resultUserAggregate = Promise.resolve(userAggregate)

describe('UpdateUserHandler', () => {
  let createUserHandler: UpdateUserCommandHandler;
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
        , UpdateUserCommandHandler,

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

    createUserHandler = moduleRef.get<UpdateUserCommandHandler>(UpdateUserCommandHandler);

  });


  test('should update a user and send an event', async () => {
    const updateMock = jest.fn().mockResolvedValue(resultUserAggregate)
    userAggregateService.update = updateMock
    const command = new UpdateUserCommand(userId, name, age);
    const commandRersult = await createUserHandler.execute(command);

    expect(eventBus.publishAll).toBeCalled()

    expect(commandRersult).toEqual(userAggregate.getId());
  });

});
