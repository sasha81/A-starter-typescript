import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger, Response, RpcExceptionFilter } from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { Metadata, status } from '@grpc/grpc-js';
import { UserErrorCodes } from "@libs/users/exceptions/UserErrorCodes";


export const GrpcStatusCode: Record<string, status> = {
  [UserErrorCodes.MALFORMED_REQUEST]: status.INVALID_ARGUMENT,
  [UserErrorCodes.NOT_FOUND]: status.NOT_FOUND,
  [UserErrorCodes.NOT_GREETED]: status.INVALID_ARGUMENT,

};


export const mapToStatus = (exceptonStatus: string | number, exceptionTypesMap: Record<string, number>): status => {
  if (exceptionTypesMap[exceptonStatus]) return exceptionTypesMap[exceptonStatus];
  return status.INTERNAL;
}

@Catch()
export class GRPCExceptionFilter implements ExceptionFilter {

  private readonly logger = new Logger(GRPCExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    //To access a grpc call metadata:  
    const metadata = host.switchToRpc().getContext().getMap();

    const response = metadata.hasOwnProperty('correlationid') ?
      { message: exception.message, code: exception.code, correlationId: metadata['correlationid'] } :
      { message: exception.message, code: exception.code }

    this.logger.error(exception, exception.stack);

    return throwError(() => ({
      code: mapToStatus(exception.code, GrpcStatusCode),

      details: JSON.stringify(response),

    }));

  }
}