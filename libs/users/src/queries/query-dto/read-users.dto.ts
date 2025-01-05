import { UserAggregate } from "@libs/users/aggregate/user.aggregate";
import { Group, MongoUserView } from "@libs/users/users-mongodb/entities/users-view-mongodb.entity";


export class UserQueryDto {
    constructor(public userId: string, public name: string, public age: number, public groups?: Group[]){}
   
}