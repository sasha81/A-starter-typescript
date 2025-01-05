import { Test, TestingModule } from '@nestjs/testing';
import { UsersUpdateService } from './users.update.service';
import { Model, Types } from 'mongoose';

import { UserViewMongoDBRepository } from './users-mongodb/repositories/users.view.mongodb.repository';
import { Group } from './users-mongodb/entities/users-view-mongodb.entity';


describe('UsersService', () => {

  let service: UsersUpdateService;
 
  let serviceQuery: UserViewMongoDBRepository;
 
  const id=1, name="Sasha", age = 42, userId='ABC',groups:Group[]=[{groupId:'abc',groupName:'A',groupStatus:true,userId:id.toString(),userStatus:false}]
    const user = {_id:new Types.ObjectId(id),userId, name, age,groups};
    const createUserDto = {userId,name: name, age: age};
   
  const resultUser = Promise.resolve(user)
  const resultUserArr = Promise.resolve([user])

  beforeAll(()=>{
   
    serviceQuery = jest.createMockFromModule('./users-mongodb/repositories/users.view.mongodb.repository')
  })


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersUpdateService,
       
        {
          provide: UserViewMongoDBRepository,
          useValue: serviceQuery
 
      }
      ],
    }).compile();

    service = module.get<UsersUpdateService>(UsersUpdateService);
  });
  it('should be defined', async() => {
    expect(service).toBeDefined();
  });

  it('should upsert a user', async () =>  {
    const createMock = jest.fn()
    serviceQuery.upsertUsers=createMock
    const createUserArr=[createUserDto]
    await service.upsertUsers(createUserArr)
   expect(createMock.mock.calls[0][0][0]).toEqual(createUserDto)
  });

 
});
