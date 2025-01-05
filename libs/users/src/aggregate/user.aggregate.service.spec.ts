import { Types } from "mongoose";
import { UserCommandMongoDBRepository } from "../users-mongodb/repositories/users.command.mongodb.repository";
import { Test, TestingModule } from "@nestjs/testing";
import { EventBus } from "@nestjs/cqrs";
import { UserAggregateService } from "./user.aggregate.service";


describe('UserAggregateService', () => {

  let service: UserAggregateService;
  let commandRepo: UserCommandMongoDBRepository;
  let eventBus: EventBus;

  const id = 1, name = "Sasha", age = 42, userId = 'ABC';
  const mongoUser = { _id: new Types.ObjectId(id), name, age, userId };
  const createUserDto = { name, age };
  const updateUserAggr = { name, age, id: userId };
  const updateUserDto = { name, age, userId };
  const resultUser = Promise.resolve(mongoUser)
  const resultUserArr = Promise.resolve([mongoUser])

  beforeAll(() => {
    commandRepo = jest.createMockFromModule('../users-mongodb/repositories/users.command.mongodb.repository')
    eventBus = jest.createMockFromModule('@nestjs/cqrs')

  })


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserAggregateService,
        {
          provide: UserCommandMongoDBRepository,
          useValue: commandRepo

        }
        , {
          provide: EventBus,
          useValue: eventBus
        }

      ],
    }).compile();

    service = module.get<UserAggregateService>(UserAggregateService);
  });
  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('should create an aggregate', async () => {
    const createMock = jest.fn().mockImplementation(({ name, age, userId }) => ({ _id: new Types.ObjectId(id), name, age, userId }))
    commandRepo.create = createMock
    const result = await service.create(createUserDto)

    expect(result.getName()).toEqual(name)
    expect(result['id'].toString().length).toEqual(36)
  });

  it('should update an aggregate', async () => {
    const updateMock = jest.fn().mockImplementation(({ name, age, userId }) => ({ _id: new Types.ObjectId(id), name, age, userId }))
    commandRepo.updateOne = updateMock
    const result = await service.update(updateUserDto)
    expect(result.getName()).toEqual(name)
    expect(result['id']).toEqual(userId)
  });
});
