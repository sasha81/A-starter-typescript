import { composeZodMessage } from "@libs/commons/zod/zod.utils";
import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { RequestValidationError } from "@ts-rest/nest";

import { ZodError, ZodIssue } from "zod";



@Catch(RequestValidationError)
export class ZodValidationExceptionFilter implements ExceptionFilter {
  catch(exception: RequestValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const issues = (exception.getResponse() as any).bodyResult.issues
    const errMessage = composeZodMessage(issues)
    const body = {
      statusCode: HttpStatus.BAD_REQUEST,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: errMessage
    } as any;



    (response as any)
      .status(HttpStatus.BAD_REQUEST)
      .json(body);


  }
}
