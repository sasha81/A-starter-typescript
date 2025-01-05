import { Test, TestingModule } from '@nestjs/testing';
import { UsersQueryResolver as UsersResolver } from './users.query.resolver';
import { GraphqlAdapterService } from '../services/graphql-adapter.service';
import { TestBed } from '@automock/jest';
import { CommandBus, QueryBus } from '@nestjs/cqrs';


const mockUserDto = {
  age: 12,
  name: 'ABC',
}

const mockUser = {
  id: '123456',
  ...mockUserDto
}
const mockUserArr = [mockUser]

describe('UserGraphqlResolver', () => {
  let resolver: UsersResolver;
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
        UsersResolver,
        { provide: GraphqlAdapterService, useValue: graphqlAdapterService },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
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


