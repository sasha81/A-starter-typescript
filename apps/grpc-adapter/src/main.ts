import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { configuration } from './config/configuration';
import { GRPCExceptionFilter } from './filters/grpc-exception-filter';


(process.env.NODE_ENV!=='prod_ext' ) && dotenv.config({path: `${process.cwd()}/apps/grpc-adapter/src/config/env/${process.env.NODE_ENV}.env`})

async function bootstrap() {
  console.log('configuration().serviceHost ', configuration().serviceHost)
  console.log('configuration().servicePort ', configuration().servicePort)
  console.log('__dirname ', __dirname)

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,{
    transport: Transport.GRPC,
    options:{
      url: `${configuration().serviceHost}:${configuration().servicePort}`,
      //The path to a proto file in the dist folder
      protoPath: join(__dirname,'/users.proto'),
      package: 'users'
    }
  });

  app.useGlobalFilters(new GRPCExceptionFilter())
  await app.listen();

}
bootstrap();
