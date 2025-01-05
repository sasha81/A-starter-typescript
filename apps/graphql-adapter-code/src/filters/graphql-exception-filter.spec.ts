import { ArgumentsHost, HttpException, NotFoundException } from "@nestjs/common";
import { GqlStatusCode, GraphqlExceptionFilter, mapToException } from "./graphql-exception-filter";
import { Test, TestingModule } from "@nestjs/testing";
import { UsersNotFoundException } from "@libs/users/exceptions/UserNotFoundException";



describe('RestExeptionFilter', () => {
  let filter: GraphqlExceptionFilter;
  let host: ArgumentsHost;


  beforeAll(async () => {

    host = jest.createMockFromModule('@nestjs/common')
  })
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({

      providers: [GraphqlExceptionFilter],
    }).compile();

    filter = module.get<GraphqlExceptionFilter>(GraphqlExceptionFilter);


  });
  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should be defined', () => {
    expect(filter).toBeDefined();
  });
  it('should correctly map to an HttpException', () => {

    const exception = new UsersNotFoundException();

    const gqlException: HttpException = mapToException(exception.code, GqlStatusCode);

    expect(gqlException instanceof NotFoundException).toBeTruthy();


  });
  it('should throw a correct exception', () => {

    const exception = new UsersNotFoundException();


    try {
      filter.catch(exception, host)
    } catch (err) {
      expect(err instanceof HttpException).toBeTruthy();
      expect(err.message).toEqual(exception.message);
    }

  });
})