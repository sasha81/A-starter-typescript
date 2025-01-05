import { Test, TestingModule } from '@nestjs/testing';
import {  UsersMutationResolver} from './users.mutations.resolver';
import { GraphqlAdapterService} from '../services/graphql-adapter.service';
import { TestBed } from '@automock/jest';
import { CommandBus, QueryBus } from '@nestjs/cqrs';


const mockUserDto= {
    age: 12,
    name: 'ABC',
}

const mockUser = {  
    userId: '123456',
    ...mockUserDto}

describe('UserMutationGraphqlResolver', () => {
    let resolver: UsersMutationResolver;
    let graphqlAdapterService: GraphqlAdapterService;
   
    beforeAll(()=>{
      jest.clearAllMocks()
      graphqlAdapterService=jest.createMockFromModule('../services/graphql-adapter.service')
    })

    afterEach(()=>{
      jest.clearAllMocks()
    })
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          UsersMutationResolver,
          { provide: GraphqlAdapterService, useValue: graphqlAdapterService},
        ],
      }).compile();
  
      resolver = module.get<UsersMutationResolver>(UsersMutationResolver);
    });
  
    it('should be defined', () => {
      expect(resolver).toBeDefined();
    });
  
    it('should create a user', async () => {
      const mockedCreatedUser = jest.fn().mockResolvedValue(Promise.resolve(mockUser));
      graphqlAdapterService.createUser= mockedCreatedUser; 

        const result = await resolver.createUser(mockUserDto)
      expect(result.userId).toEqual(mockUser.userId);
      expect(result.name).toEqual(mockUserDto.name);
      expect(result.age).toEqual(mockUserDto.age);
      expect(mockedCreatedUser).toBeCalledWith(mockUserDto)
     
    });  
  
    it('should update a user', async () => {
      const mockedUpdatedUser = jest.fn().mockResolvedValue(Promise.resolve(mockUser));
      graphqlAdapterService.updateUser= mockedUpdatedUser; 

        const result = await resolver.updateUser(mockUser)
      expect(result).toEqual(mockUser);
      expect(mockedUpdatedUser).toBeCalledWith(mockUser)
     
    });  

  });


