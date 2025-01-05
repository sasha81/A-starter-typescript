import { Group } from "@libs/users/users-mongodb/entities/users-view-mongodb.entity";
import { Types } from "mongoose";
import { getQueryDtoFromMongoUser } from "./entity-to-querydto.converter";


describe('getQueryDtoFromMongoUser',()=>{
    it('should convert a mongoUser to a QueryViewDto with a group',()=>{
        const userId='ABC'
        const group = {groupId:'abc',groupName:'A',groupStatus:true,userId,userStatus:false}
       const groupMap = new Map<string, Group>();
       groupMap.set(group.groupId,group)
        const id=1, name="Sasha", age = 42, groups:Map<string, Group>=groupMap;
        const user = {_id:new Types.ObjectId(id),userId, name, age,groups};
        const result = getQueryDtoFromMongoUser(user );
        expect(result.userId).toEqual(userId)
        expect(result.name).toEqual(name)
        expect(result.age).toEqual(age)
        expect(result.groups).toEqual([group])
    })

    it('should convert a mongoUser to a QueryViewDto with no group',()=>{
        const userId='ABC'
      
       const groupMap = new Map<string, Group>();
       
        const id=1, name="Sasha", age = 42, groups:Map<string, Group>=groupMap;
        const user = {_id:new Types.ObjectId(id),userId, name, age,groups};
        const result = getQueryDtoFromMongoUser(user );
        expect(result.userId).toEqual(userId)
        expect(result.name).toEqual(name)
        expect(result.age).toEqual(age)
        expect(result.groups).toEqual([])
    })
})