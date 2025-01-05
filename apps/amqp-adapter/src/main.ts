import { NestFactory } from '@nestjs/core';
import { AmqpAdapterModule } from './amqp-adapter.module';
import * as dotenv from 'dotenv';
import { DEFAULT_HOST_PORT } from './config/default-consts';

(process.env.NODE_ENV!=='prod_ext' ) && dotenv.config({path: `${process.cwd()}/apps/amqp-adapter/src/config/env/${process.env.NODE_ENV}.env`})

async function bootstrap() {
  const app = await NestFactory.create(AmqpAdapterModule);
  await app.listen(parseInt(process.env.PORT ?process.env.PORT : DEFAULT_HOST_PORT , 10));
}
bootstrap();
