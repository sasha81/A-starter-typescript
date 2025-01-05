import { convertMongoUserToUserAggregate } from "@libs/users/aggregate/entity-to-aggregate-converter";
import { UserQueryDto } from "./read-users.dto";
import { MongoUser } from "@libs/users/users-mongodb/entities/users-mongodb.entity";
import { MongoUserView } from "@libs/users/users-mongodb/entities/users-view-mongodb.entity";


export const getQueryDtoFromMongoUser=(mongoUser: MongoUserView):UserQueryDto=>{
    const {userId, name, age} = mongoUser
    return {userId, name, age, groups:mongoUser.groups ? Array.from(mongoUser.groups, ([_,val])=>({...val}))  :[] };
}
