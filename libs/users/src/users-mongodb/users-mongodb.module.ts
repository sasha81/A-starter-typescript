import { Module } from '@nestjs/common';
import { configuration } from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entities/users-mongodb.entity';
import { UserCommandMongoDBRepository } from './repositories/users.command.mongodb.repository';
import { ConfigModule } from '@nestjs/config';
import { UserViewSchema } from './entities/users-view-mongodb.entity';
import { UserViewMongoDBRepository } from './repositories/users.view.mongodb.repository';


@Module({
  imports: [

    ...(process.env.NODE_ENV === 'prod_ext' ? [] : [ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/libs/users/src/users-mongodb/config/env/${process.env.NODE_ENV}.env`,
      load: [configuration]
    })]),
    MongooseModule.forRoot(`mongodb://${configuration().MONGO_USER}:${configuration().MONGO_PWD}@${configuration().MONGO_HOST}:${configuration().MONGO_PORT}/${configuration().MONGO_AGGR_DB}?authSource=admin&readPreference=primary&ssl=false&directConnection=true`, { connectionName: 'MONGO_AGGR' }),
    MongooseModule.forRoot(`mongodb://${configuration().MONGO_USER}:${configuration().MONGO_PWD}@${configuration().MONGO_HOST}:${configuration().MONGO_PORT}/${configuration().MONGO_VIEW_DB}?authSource=admin&readPreference=primary&ssl=false&directConnection=true`, { connectionName: 'MONGO_VIEW' }),
    MongooseModule.forFeature([{ name: 'USERS', schema: UserSchema }], 'MONGO_AGGR'),
    MongooseModule.forFeature([{ name: 'USERS-VIEW', schema: UserViewSchema }], 'MONGO_VIEW'),
  ],
  providers: [UserCommandMongoDBRepository, UserViewMongoDBRepository],
  exports: [UserCommandMongoDBRepository, UserViewMongoDBRepository]
})
export class UsersMongodbModule { }
