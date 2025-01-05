import { IMongoUser, MongoUser} from "../users-mongodb/entities/users-mongodb.entity";
import { UserAggregate } from "./user.aggregate";

export const convertMongoUserToUserAggregate = (mongoUser: MongoUser): UserAggregate=>{
    return new UserAggregate(mongoUser.userId, mongoUser.name, mongoUser.age)
}

export const convertUserAggregateToMongoUser = (userAggregate: UserAggregate): IMongoUser=>{    
    return {userId: userAggregate.getId(), name: userAggregate.getName(), age: userAggregate.getAge()}
}