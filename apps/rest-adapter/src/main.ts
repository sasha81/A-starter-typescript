import { NestFactory } from '@nestjs/core';
import { RestAdapterModule } from './rest-adapter.module';
import * as dotenv from 'dotenv';
import { SwaggerModule } from '@nestjs/swagger';
import { generateOpenApi } from '@ts-rest/open-api';
import { userApi } from './ts-rest-contracts/user-contract';
import { DEFAULT_HOST_PORT } from './config/default-consts'
import { RestExceptionFilter } from './filters/rest-exception-filter';
import { ZodValidationExceptionFilter } from './filters/zod-exception-filter';

(process.env.NODE_ENV !== 'prod_ext') && dotenv.config({ path: `${process.cwd()}/apps/rest-adapter/src/config/env/${process.env.NODE_ENV}.env` })
async function bootstrap() {
  console.log('process.env.NODE_ENV ', process.env.NODE_ENV)
  const app = await NestFactory.create(RestAdapterModule);
  app.enableCors();
  const document = generateOpenApi(userApi, {
    info: {
      title: 'Users API',
      version: '1.0.0',
    },
  },

    {
      setOperationId: true,
    });

  SwaggerModule.setup('users/api', app, document);

  app.useGlobalFilters(new RestExceptionFilter(), new ZodValidationExceptionFilter())
  await app.listen(process.env.PORT ? process.env.PORT : parseInt(DEFAULT_HOST_PORT, 10));
}
bootstrap();
