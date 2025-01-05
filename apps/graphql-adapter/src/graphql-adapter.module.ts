import { HttpException, Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';

import { GraphqlAdapterService } from './services/graphql-adapter.service';
import { join } from 'path';
import { UsersModule, commandHandlers, queryHandlers } from '@libs/users/users.module';
import { CqrsModule } from '@nestjs/cqrs';

import { ConfigModule } from '@nestjs/config';
import { configuration } from './config/configuration';
import { EurekaModule } from 'nest-eureka';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserCreatedHandler } from './services/user-event-handler.service';
import { UsersMutationResolver } from './resolvers/users.mutations.resolver';
import { UsersQueryResolver } from './resolvers/users.query.resolver';
console.log('GraphqlAdapterModule process.cwd(): ', process.cwd())
console.log('GraphqlAdapterModule join(process.cwd(): ', join(process.cwd(), 'apps/graphql-adapter/src/graphql-schemas/user.graphql'))
console.log('GraphqlAdapterModule __dirname: ', __dirname)


const eventHandlers = [UserCreatedHandler]
@Module({
  imports: [
    ...(process.env.NODE_ENV === 'prod_ext' ? [] : [ConfigModule.forRoot({
      envFilePath: join(process.cwd(), `apps/graphql-adapter/src/config/env/${process.env.NODE_ENV}.env`),
      load: [configuration]
    })]),
    GraphQLModule.forRoot<ApolloDriverConfig>({

      driver: ApolloDriver,
      typePaths: [join(process.cwd(), 'apps/graphql-adapter/src/graphql-schemas/*.graphql')],
      definitions: {
        path: join(process.cwd(), 'apps/graphql-adapter/src/graphql-types/graphql-types.ts'),
      },
      formatError: (error) => {
        const originalError = error.extensions
          ?.originalError as HttpException;

        if (!originalError) {
          return {
            message: error.message,
            code: error.extensions?.code,
          };
        }
        return {
          message: originalError.message,
          code: error.extensions?.code,
        };
      }
    }),
    EurekaModule.forRoot({
      eureka: {
        host: configuration().eurekaHost,
        port: configuration().eurekaPort,
        registryFetchInterval: 1000,
        servicePath: configuration().eurekaPath,
        maxRetries: 3,
      },
      service: {
        name: 'graphql-adapter',
        port: configuration().eurekaRegisterPort,
      },
    }),
    ClientsModule.register([
      {
        name: 'external-message-bus',
        transport: Transport.RMQ,
        options: {
          urls: [
            configuration().rabbitMQuser ? `amqp://${configuration().rabbitMQuser}:${configuration().rabbitMQpwd}@${configuration().rabbitMQrl}` : `amqp://${configuration().rabbitMQrl}`,
          ],
          queue: `${configuration().queue}`,
          queueOptions: {
            durable: true
          },
        },
      },
    ]),
    CqrsModule,
    UsersModule
  ],
  controllers: [],
  providers: [GraphqlAdapterService, UsersMutationResolver, UsersQueryResolver, ...eventHandlers, ...commandHandlers, ...queryHandlers],
})
export class GraphqlAdapterModule { }
