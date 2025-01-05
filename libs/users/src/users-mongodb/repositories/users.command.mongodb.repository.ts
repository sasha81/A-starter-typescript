import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IMongoUser, MongoUser } from "../entities/users-mongodb.entity";



@Injectable()
export class UserCommandMongoDBRepository {
  constructor(@InjectModel('USERS', 'MONGO_AGGR') private userModel: Model<MongoUser>) { }


  async create(createUserDto: IMongoUser): Promise<MongoUser> {
    const createdUser = new this.userModel(createUserDto)
    const result = await createdUser.save();
    return result
  }

  async updateOne(createUserDto: IMongoUser): Promise<MongoUser> {
    const { userId, ...rest } = createUserDto

    const updatedUser = await this.userModel.findOneAndUpdate({
      userId: createUserDto.userId
    }, {
      $set: {
        ...rest
      }
    },
      { new: true }
    )
    if (updatedUser) return updatedUser
    else throw new Error('Update Failed')
  }
}