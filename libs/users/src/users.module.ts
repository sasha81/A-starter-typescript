import { Module } from '@nestjs/common';
import { UsersUpdateService } from './users.update.service';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config/configuration';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserHandler } from './commands/handlers/create-user-command.handler';
import { UserQueryHandler } from './queries/handlers/find-user.query.handler';
import { GreetQueryHandler } from './queries/handlers/greet.query.handler';
import { UsersMongodbModule } from './users-mongodb/users-mongodb.module';
import { UserAggregateService } from './aggregate/user.aggregate.service';
import { UserQueryService } from './queries/user.query.service';
import { UpdateUserCommandHandler } from './commands/handlers/update-users-command.handler';

export const commandHandlers = [CreateUserHandler, UpdateUserCommandHandler]
export const queryHandlers = [UserQueryHandler, GreetQueryHandler]


console.log('process.cwd()} in libs/users/src/ : ', process.cwd())
@Module({
  imports: [

    ...(process.env.NODE_ENV === 'prod_ext' ? [] : [ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/libs/users/src/config/env/${process.env.NODE_ENV}.env`,
      load: [configuration]
    })]), CqrsModule,

    UsersMongodbModule
  ],
  providers: [UsersUpdateService, UserAggregateService, UserQueryService, ...commandHandlers, ...queryHandlers],
  exports: [UsersUpdateService, UserAggregateService, UserQueryService]
})
export class UsersModule { }
