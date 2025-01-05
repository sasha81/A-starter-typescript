import { ArgumentsHost, HttpStatus } from "@nestjs/common";
import { RestExceptionFilter, HttpStatusCode, mapToStatus } from "./rest-exception-filter";
import { Test, TestingModule } from "@nestjs/testing";
import { UsersNotFoundException } from "@libs/users/exceptions/UserNotFoundException";





describe('RestExeptionFilter', () => {
  let filter: RestExceptionFilter;
  let host: ArgumentsHost;
  let statusMock;
  let bodyMock
  const dateNow = new Date(Date.UTC(2017, 1, 14)).valueOf()

  beforeAll(async () => {
    Date.now = jest.fn(() => dateNow)
    jest.useRealTimers()
    host = jest.createMockFromModule('@nestjs/common')
  })
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({

      providers: [RestExceptionFilter],
    }).compile();

    filter = module.get<RestExceptionFilter>(RestExceptionFilter);

    bodyMock = jest.fn();
    statusMock = jest.fn().mockImplementation((status: HttpStatus) => {
      return {
        json: bodyMock
      }
    })
  });
  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should return correct error message, code', () => {

    const exception = new UsersNotFoundException();
    const url = 'http://hello:3000/world';
    const status = mapToStatus(exception.code, HttpStatusCode);
    let body = {
      statusCode: status,
      module: 'User',
      path: url,
      message: exception.message
    }

    host.switchToHttp = jest.fn().mockImplementation(() => {
      return {
        getResponse: <T>() => {
          return {
            status: statusMock
          }
        },
        getRequest: <T>() => {
          return {
            url
          }
        }
      }
    });
    filter.catch(exception, host);
    expect(bodyMock).toBeCalledWith(expect.objectContaining(body));
    expect(statusMock).toBeCalledWith(status);

  });
  it('should map to correct error codes', () => {
    const exception = new UsersNotFoundException();

    const result = mapToStatus(exception.code, HttpStatusCode);
    expect(result).toEqual(HttpStatus.NOT_FOUND)
  });

});
