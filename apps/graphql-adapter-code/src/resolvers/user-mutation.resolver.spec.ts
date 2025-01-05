import { Test, TestingModule } from '@nestjs/testing';

import { GraphqlAdapterService } from '../services/graphql-adapter.service';
import { TestBed } from '@automock/jest';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UsersMutationResolver } from './user-mutation.resolver';


const mockUserDto = {
  age: 12,
  name: 'ABC',
}

const mockUser = {
  userId: '123456',
  ...mockUserDto
}


describe('UserGraphqlResolver', () => {
  let resolver: UsersMutationResolver;
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
        UsersMutationResolver,
        { provide: GraphqlAdapterService, useValue: graphqlAdapterService },
      ],
    }).compile();

    resolver = module.get<UsersMutationResolver>(UsersMutationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should create a user', async () => {
    const mockedCreatedUser = jest.fn().mockResolvedValue(Promise.resolve(mockUser));
    graphqlAdapterService.createUser = mockedCreatedUser;

    const result = await resolver.createUser(mockUserDto)
    expect(result.userId).toBe(mockUser.userId);
    expect(mockedCreatedUser).toBeCalledWith(mockUserDto)

  });

  it('should update a user', async () => {
    const mockedCreatedUser = jest.fn().mockResolvedValue(Promise.resolve(mockUser));
    graphqlAdapterService.updateUser = mockedCreatedUser;

    const result = await resolver.updateUser(mockUser)
    expect(result.userId).toBe(mockUser.userId);
    expect(mockedCreatedUser).toBeCalledWith(mockUser)

  });


});