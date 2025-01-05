import { NestFactory } from '@nestjs/core';
import { GraphqlAdapterModule } from './graphql-adapter.module';
import * as dotenv from 'dotenv';
import { DEFAULT_FRONT_URI, DEFAULT_GATEWAY_URI, DEFAULT_HOST_PORT } from './config/default-consts';
import { GraphqlExceptionFilter } from './filters/graphql-exception-filter';
import { ZodValidationExceptionFilter } from './filters/zod-exception-filter';
(process.env.NODE_ENV!=='prod_ext' ) && dotenv.config({path: `${process.cwd()}/apps/graphql-adapter/src/config/env/${process.env.NODE_ENV}.env`})


async function bootstrap() {
  const app = await NestFactory.create(GraphqlAdapterModule);
  app.enableCors({
    origin: true,
    //Example of cors origins:
      // [ process.env.FRONT_URI?process.env.FRONT_URI:DEFAULT_FRONT_URI,
      // process.env.GATEWAY_URI?process.env.GATEWAY_URI:DEFAULT_GATEWAY_URI],   
     credentials: false,
  });

  app.useGlobalFilters(new GraphqlExceptionFilter(), new ZodValidationExceptionFilter())
  await app.listen(process.env.PORT || DEFAULT_HOST_PORT);
}
bootstrap();
