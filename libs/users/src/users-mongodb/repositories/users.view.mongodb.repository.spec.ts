import { Types } from "mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { getUserModelStub } from "../entities/UserModelStub";
import { MongoUser } from "../entities/users-mongodb.entity";
import { UserViewMongoDBRepository } from "./users.view.mongodb.repository";



describe('UserViewMongoDBRepository', () => {
  let service: UserViewMongoDBRepository;

  const id = 1; const name = "Sasha"; const age = 42; const userId = 'abcdef'
  const user: MongoUser = { _id: new Types.ObjectId(id), userId, name, age };
  const userDto = { name: name, age: age };
  const resultUser = Promise.resolve(user)
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserViewMongoDBRepository,
        {
          provide: getModelToken('USERS-VIEW', 'MONGO_VIEW'),
          useValue: getUserModelStub(user)

        }

      ],
    }).compile();

    service = module.get<UserViewMongoDBRepository>(UserViewMongoDBRepository);
  });
  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('should find all users', async () => {
    const result = await service.findAll()
    expect(result.length).toEqual(1)
    expect(result[0]['_id'].toString().length).toEqual(24)
  });


});
