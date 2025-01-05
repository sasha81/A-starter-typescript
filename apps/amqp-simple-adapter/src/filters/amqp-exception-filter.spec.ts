import { ArgumentsHost } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AmqpExceptionFilter } from "./amqp-exception-filter";
import { UsersNotFoundException } from "@libs/users/exceptions/UserNotFoundException";
import { AmqpSenderService } from "../services/amqp-sender.service";




describe('AmqpExeptionFilter', () => {
  let filter: AmqpExceptionFilter;
  let host: ArgumentsHost;
  let senderService: AmqpSenderService;
  beforeAll(async () => {
    jest.useRealTimers()
    host = jest.createMockFromModule('@nestjs/common');
    senderService = jest.createMockFromModule('../services/amqp-sender.service');
  })
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({

      providers: [AmqpExceptionFilter, { provide: AmqpSenderService, useValue: senderService }],
    }).compile();

    filter = module.get<AmqpExceptionFilter>(AmqpExceptionFilter);
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
        expect(err.toString()).toEqual(exception.toString())

        done();
      }
    });
  });


});
