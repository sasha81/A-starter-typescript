import { UserQueryDto } from "@libs/users/queries/query-dto/read-users.dto"
import { Group } from "@libs/users/users-mongodb/entities/users-view-mongodb.entity"
import { getUserDtoWithGroupsFromQueryDto } from "./cqrs-user.converter"

describe('cqrs-converter-rest', ()=>{
    const id=1,userId='ABC', name="Sasha", age = 42, groups:Group[]=[{groupId:'abc',groupName:'A',groupStatus:true,userId,userStatus:false}]
    const createUserDto = {name,age}
    const createdUser = {userId,name,age}
 const userQueryDto = [new UserQueryDto(userId,name,age,groups)]

    it('getUserDtoWithGroupsFromQueryDto works corerectly with groups',()=>{
        const result = getUserDtoWithGroupsFromQueryDto(userQueryDto);
        expect(result[0].name).toEqual(name)
        expect(result[0].userId).toEqual(userId)
        expect(result[0].age).toEqual(age)
        expect(result[0].groups).toEqual(groups)
    })

    it('getUserDtoWithGroupsFromQueryDto works corerectly without groups',()=>{
        const userQueryDto = [new UserQueryDto(userId,name,age)]
        const result = getUserDtoWithGroupsFromQueryDto(userQueryDto)
        expect(result[0].groups.length).toEqual(0)
        expect(result[0].name).toEqual(name)
        expect(result[0].userId).toEqual(userId)
        expect(result[0].age).toEqual(age)
    })
})