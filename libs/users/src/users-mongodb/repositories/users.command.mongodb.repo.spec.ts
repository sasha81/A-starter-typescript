import { Types } from "mongoose";
import { UserCommandMongoDBRepository } from "./users.command.mongodb.repository";
import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { getUserModelStub } from "../entities/UserModelStub";
import { MongoUser } from "../entities/users-mongodb.entity";



describe('UserCommandMongoDBRepository', () => {
  let service: UserCommandMongoDBRepository;

  const id = 1, name = "Sasha", age = 42, userId = 'ABC';
  const user: MongoUser = { _id: new Types.ObjectId(id), name, age, userId };
  const userDto = { name, age, userId };
  const resultUser = Promise.resolve(user)
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserCommandMongoDBRepository,
        {
          provide: getModelToken('USERS', 'MONGO_AGGR'),
          useValue: getUserModelStub(user, user)

        }

      ],
    }).compile();

    service = module.get<UserCommandMongoDBRepository>(UserCommandMongoDBRepository);
  });
  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {

    const result = await service.create(userDto)
    expect(result.name).toEqual(name)
    expect(result['_id'].toString().length).toEqual(24)
  });
  it('should update a user', async () => {

    const result = await service.updateOne(user)
    expect(result.name).toEqual(name)
    expect(result.userId).toEqual(userId)
    expect(result.age).toEqual(age)
    expect(result['_id'].toString().length).toEqual(24)
  });

});
