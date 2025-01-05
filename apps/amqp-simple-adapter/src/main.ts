import { NestFactory } from '@nestjs/core';
import { AmqpAdapterModule } from './amqp-simple-adapter.module';
import * as dotenv from 'dotenv';
import { ClientProxy, MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AmqpExceptionFilter} from './filters/amqp-exception-filter';
import { AmqpSenderService } from './services/amqp-sender.service';

(process.env.NODE_ENV!=='prod_ext' ) && dotenv.config({path: `${process.cwd()}/apps/amqp-simmple-adapter/src/config/env/${process.env.NODE_ENV}.env`})
console.log('serv process.cwd(): ',process.cwd())
console.log(' process.env.AMQP_EXCHANGE: ',process.env.AMQP_EXCHANGE)
console.log(' process.env.AMQP_QUEUE: ',process.env.AMQP_QUEUE)

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AmqpAdapterModule
    , {
        transport: Transport.RMQ,
        options: {
            
          urls: [`amqp://${process.env.RABBIT_MQ_USER}:${process.env.RABBIT_MQ_PWD}@${process.env.RABBIT_MQ_URL}`],
          queue: process.env.AMQP_QUEUE,
          queueOptions: {
            durable: true
          },
        },
      }
    
    
    );

 const senderService = app.get<AmqpSenderService>(AmqpSenderService)
 app.useGlobalFilters(new AmqpExceptionFilter(senderService))
  await app.listen();
}
bootstrap();
