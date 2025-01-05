import { composeZodMessage } from "@libs/commons/zod/zod.utils";
import { BadRequestException, Catch, ExceptionFilter } from "@nestjs/common";
import { ZodValidationException } from "nestjs-zod";
import { ZodError, ZodIssue } from "zod";
@Catch(ZodValidationException)
export class ZodValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ZodValidationException) {

    const zodError = exception.getZodError()
    const badReqException = new BadRequestException(composeZodMessage(zodError.issues));
    throw badReqException;
  }
}
