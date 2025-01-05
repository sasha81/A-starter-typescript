import { Test, TestingModule } from "@nestjs/testing";
import { UserQueryService } from "./user.query.service";
import { Types } from "mongoose";
import { Group } from "../users-mongodb/entities/users-view-mongodb.entity";
import { UserViewMongoDBRepository } from "../users-mongodb/repositories/users.view.mongodb.repository";


describe('UserQueryService', () => {

  let service: UserQueryService;

  let serviceQuery: UserViewMongoDBRepository;
  const userId = 'ABC'
  const group = { groupId: 'abc', groupName: 'A', groupStatus: true, userId, userStatus: false }
  const groupMap = new Map<string, Group>();
  groupMap.set(group.groupId, group)
  const id = 1, name = "Sasha", age = 42, groups: Map<string, Group> = groupMap;
  const user = { _id: new Types.ObjectId(id), userId, name, age, groups };
  const userDto = { name: name, age: age };
  const resultUser = Promise.resolve(user)
  const resultUserArr = Promise.resolve([user])

  beforeAll(() => {

    serviceQuery = jest.createMockFromModule('../users-mongodb/repositories/users.view.mongodb.repository')
  })


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserQueryService,

        {
          provide: UserViewMongoDBRepository,
          useValue: serviceQuery

        }
      ],
    }).compile();

    service = module.get<UserQueryService>(UserQueryService);
  });
  it('should be defined', async () => {
    expect(service).toBeDefined();
  });



  it('should find all users', async () => {
    const findAllMock = jest.fn().mockResolvedValue(resultUserArr)
    serviceQuery.findAll = findAllMock;
    const result = await service.findAllUsers()
    expect(result.length).toEqual(1)
    expect(result[0]['userId']).toEqual(user['userId'])
    result[0]?.groups && expect(result[0]['groups'][0]['groupId']).toEqual(group.groupId)
  });
});
