import { ArgumentsHost, Catch, Inject, Logger, NotFoundException, RpcExceptionFilter } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { Observable, throwError } from "rxjs";
import { AmqpSenderService } from "../services/amqp-sender.service";
import { Exception } from "@libs/commons/exceptions/CommonExceptions";


@Catch()
export class AmqpExceptionFilter implements RpcExceptionFilter {
  private readonly logger = new Logger(AmqpExceptionFilter.name);
  constructor(private readonly senderService: AmqpSenderService) { }

  catch(exception: Exception, host: ArgumentsHost): Observable<any> {

    this.logger.error(exception, exception.stack);

    return throwError(() => (exception.toString()));
  }
}