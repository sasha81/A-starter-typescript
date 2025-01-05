import { Test, TestingModule } from '@nestjs/testing';

import { GraphqlAdapterService } from '../services/graphql-adapter.service';
import { TestBed } from '@automock/jest';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UsersQueryResolver } from './user-query.resolver';


const mockUserDto = {
  age: 12,
  name: 'ABC',
}

const mockUser = {
  userId: '123456',
  ...mockUserDto
}
const mockUserArr = [mockUser]

describe('UserGraphqlResolver', () => {
  let resolver: UsersQueryResolver;
  let graphqlAdapterService: GraphqlAdapterService;

  beforeAll(() => {
    graphqlAdapterService = jest.createMockFromModule('../services/graphql-adapter.service')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersQueryResolver,
        { provide: GraphqlAdapterService, useValue: graphqlAdapterService },
      ],
    }).compile();

    resolver = module.get<UsersQueryResolver>(UsersQueryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });



  it('should get all users', async () => {
    const mockedGetAllUsers = jest.fn().mockResolvedValue(Promise.resolve(mockUserArr))
    graphqlAdapterService.getAllUsers = mockedGetAllUsers;
    expect(
      await resolver.getAllUsers()
    ).toBe(mockUserArr);


  });


});