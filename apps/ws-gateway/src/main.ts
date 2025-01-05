import { NestFactory } from '@nestjs/core';
import { WsGatewayModule } from './ws-gateway.module';
import { DEFAULT_HOST_PORT } from './config/default-consts';

async function bootstrap() {
  const app = await NestFactory.create(WsGatewayModule);
  app.enableCors(); 
  await app.listen(process.env.PORT ? process.env.PORT : parseInt(DEFAULT_HOST_PORT , 10));
}
bootstrap();
