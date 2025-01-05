import { UserErrorCodes } from "@libs/users/exceptions/UserErrorCodes";
import { ArgumentsHost, BadRequestException, Catch, HttpException, ImATeapotException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { GqlExceptionFilter } from "@nestjs/graphql";


export const GqlStatusCode: Record<string, () => HttpException> = {
  [UserErrorCodes.MALFORMED_REQUEST]: () => { return new BadRequestException() },
  [UserErrorCodes.NOT_FOUND]: () => { return new NotFoundException() },
  [UserErrorCodes.NOT_GREETED]: () => { return new ImATeapotException() },

};


export const mapToException = (exceptonStatus: string | number, exceptionTypesMap: Record<string, () => HttpException>): HttpException => {
  if (exceptionTypesMap[exceptonStatus]) return exceptionTypesMap[exceptonStatus]();
  return new InternalServerErrorException();
}

@Catch()
export class GraphqlExceptionFilter implements GqlExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const gqlException: HttpException = mapToException(exception.code, GqlStatusCode);
    gqlException.message = exception.message;
    if (exception?.stack) gqlException.stack = exception.stack;
    throw gqlException;
  }

}