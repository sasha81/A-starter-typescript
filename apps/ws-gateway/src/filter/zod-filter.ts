import { ArgumentsHost, Catch, ExceptionFilter, Injectable } from "@nestjs/common";
import { ZodValidationException } from "nestjs-zod";
import { composeZodMessage } from "@libs/commons/zod/zod.utils";

@Injectable()
@Catch(ZodValidationException)
export class ZodValidationExceptionFilter implements ExceptionFilter {
      catch(exception: ZodValidationException, host: ArgumentsHost) {

    const zodError = exception.getZodError() 
    const client = host.switchToWs().getClient() as WebSocket;
    const data = host.switchToWs().getData();
   
   client.send(  {error: composeZodMessage(zodError.issues),
    ...data} )
 
}
}

