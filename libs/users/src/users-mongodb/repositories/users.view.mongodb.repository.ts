import { Model } from "mongoose";
import { Group, MongoUserView } from "../entities/users-view-mongodb.entity";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable, Logger } from "@nestjs/common";
import { IMongoUser } from "../entities/users-mongodb.entity";
import { DEFAULT_QUERY_LIMIT } from "@libs/users/config/default-consts";



@Injectable()
export class UserViewMongoDBRepository {
  private readonly logger = new Logger(UserViewMongoDBRepository.name);
  constructor(@InjectModel('USERS-VIEW', 'MONGO_VIEW') private userViewModel: Model<MongoUserView>) { }

  async findAll(lim=DEFAULT_QUERY_LIMIT): Promise<MongoUserView[]> {
    const result = await this.userViewModel.find({}).limit(lim);
    this.logger.log('users query: ', result)
    return result;
  }

  async upsertUsers(updateUserArr: IMongoUser[]): Promise<void> {

    const bulOps = updateUserArr.map(user => ({
      updateOne: {
        filter: {
          userId: user.userId
        },
        update: {
          $set: {
            ...user
          }
        },
        upsert: true,

      }

    }))
    const result = await this.userViewModel.collection.bulkWrite(bulOps);

  }
  async upsertUserGroup(groups: Group[]): Promise<void> {

    const bulOps = groups.map(group => {

      return {
        updateOne: {
          filter: {
            userId: group.userId
          },
          update: {
            $set: {
              [`groups.${group.groupId}`]: group
            }
          },
          upsert: false
        }

      }
    })
    const result = await this.userViewModel.collection.bulkWrite(bulOps)
  }

}