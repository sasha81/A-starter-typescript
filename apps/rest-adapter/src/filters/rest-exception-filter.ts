import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, throwError } from 'rxjs';

import { Exception } from '@libs/commons/exceptions/CommonExceptions';
import { UserErrorCodes } from '@libs/users/exceptions/UserErrorCodes';


export const HttpStatusCode: Record<string, number> = {
  [UserErrorCodes.MALFORMED_REQUEST]: HttpStatus.BAD_REQUEST,
  [UserErrorCodes.NOT_FOUND]: HttpStatus.NOT_FOUND,
  [UserErrorCodes.NOT_GREETED]: HttpStatus.NOT_ACCEPTABLE,

};


export const mapToStatus = (exceptonStatus: string | number, exceptionTypesMap: Record<string, number>): HttpStatus => {
  if (exceptionTypesMap[exceptonStatus]) return exceptionTypesMap[exceptonStatus];
  return HttpStatus.INTERNAL_SERVER_ERROR;
}

@Catch()
export class RestExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(RestExceptionFilter.name);

  catch(exception: Exception, host: ArgumentsHost): Observable<never> | void {

    this.logger.error(exception, exception.stack);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = mapToStatus(exception.code, HttpStatusCode);

    let body = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message
    } as any

    if (exception.module) body = { ...body, module: exception.module }

    response
      .status(status)
      .json(body);


  }
}