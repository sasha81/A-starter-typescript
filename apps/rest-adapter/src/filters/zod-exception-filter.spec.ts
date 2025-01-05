import { ArgumentsHost, BadRequestException, HttpStatus } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { ZodValidationExceptionFilter } from "./zod-exception-filter";
import { ZodError, ZodIssue, ZodIssueCode } from "zod";
import { ZodValidationException } from "nestjs-zod";
import { RequestValidationError } from "@ts-rest/nest";
import { composeZodMessage } from "@libs/commons/zod/zod.utils";




describe('ZodExeptionFilter', () => {
  let filter: ZodValidationExceptionFilter;
  let host: ArgumentsHost;
  let statusMock;
  let bodyMock

  beforeAll(async () => {

    host = jest.createMockFromModule('@nestjs/common')
  })
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({

      providers: [ZodValidationExceptionFilter],
    }).compile();

    filter = module.get<ZodValidationExceptionFilter>(ZodValidationExceptionFilter);
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
    //@ts-ignore
    const issues: ZodIssue[] = [{ path: ['age'], message: 'Broken!' }];
    const zodError = new ZodError(issues);
    const status = HttpStatus.BAD_REQUEST
    const exception = new RequestValidationError(null, null, null, zodError);
    const url = 'http://hello:3000/world';

    let body = {
      statusCode: status,
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
    expect(bodyMock).toBeCalledWith(expect.objectContaining({ statusCode: status }));
    expect(bodyMock).toBeCalledWith(expect.objectContaining({ message: composeZodMessage(issues) }));
    expect(bodyMock).toBeCalledWith(expect.objectContaining({ path: url }));
    expect(statusMock).toBeCalledWith(status);

  });
})