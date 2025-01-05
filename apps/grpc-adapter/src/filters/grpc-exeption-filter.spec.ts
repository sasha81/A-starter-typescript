import { Test, TestingModule } from "@nestjs/testing";
import { GRPCExceptionFilter, GrpcStatusCode, mapToStatus } from "./grpc-exception-filter";
import { ArgumentsHost } from "@nestjs/common";
import { UsersNotFoundException } from "@libs/users/exceptions/UserNotFoundException";
import { status } from "@grpc/grpc-js";

describe('GrpcExeptionFilter', () => {
  let filter: GRPCExceptionFilter;
  let host: ArgumentsHost;
  beforeAll(async () => {
    jest.useRealTimers()
    host = jest.createMockFromModule('@nestjs/common')
  })
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({

      providers: [GRPCExceptionFilter],
    }).compile();

    filter = module.get<GRPCExceptionFilter>(GRPCExceptionFilter);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should return correct error message, code, and correlationid if present', (done) => {
    const correlationId = 'abcdef';
    const exception = new UsersNotFoundException();

    host.switchToRpc = jest.fn().mockImplementation(() => {
      return {
        getContext: () => {
          return {
            getMap: () => {
              return { correlationid: correlationId }
            }
          }
        }
      }
    });
    const thrown = filter.catch(exception, host);
    thrown.subscribe({

      error: err => {
        expect(err.code).toEqual(mapToStatus(exception.code, GrpcStatusCode))
        expect(JSON.parse(err.details).correlationId).toEqual(correlationId);
        expect(JSON.parse(err.details).message).toEqual(exception.message);
        done();
      }
    });
  });

  it('should return correct error message, code, without a correlationid', (done) => {
    const correlationId = 'abcdef';
    const exception = new UsersNotFoundException();

    host.switchToRpc = jest.fn().mockImplementation(() => {
      return {
        getContext: () => {
          return {
            getMap: () => {
              return {}
            }
          }
        }
      }
    });
    const thrown = filter.catch(exception, host);
    thrown.subscribe({

      error: err => {
        expect(err.code).toEqual(mapToStatus(exception.code, GrpcStatusCode))
        expect(JSON.parse(err.details)).not.toHaveProperty('correlationId');
        expect(JSON.parse(err.details).message).toEqual(exception.message);
        done();
      }
    });
  });
  it('should map to correct error codes', () => {

    const exception = new UsersNotFoundException()
    const result = mapToStatus(exception.code, GrpcStatusCode);
    expect(result).toEqual(status.NOT_FOUND)
  });


});
