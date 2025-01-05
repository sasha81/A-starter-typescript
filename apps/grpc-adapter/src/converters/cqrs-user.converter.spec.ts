import { UserQueryDto } from "@libs/users/queries/query-dto/read-users.dto"
import { Group } from "@libs/users/users-mongodb/entities/users-view-mongodb.entity"
import { convertUserViewToGRPCDto } from "./view-dto.converter"

describe('cqrs-converter-rest', () => {
    const id = 1, userId = 'ABC', name = "Sasha", age = 42, groups: Group[] = [{ groupId: 'abc', groupName: 'A', groupStatus: true, userId, userStatus: false }]
    const createUserDto = { name, age }
    const createdUser = { userId, name, age }


    it('getUserDtoWithGroupsFromQueryDto works corerectly with groups', async () => {
        const userQueryDto = [new UserQueryDto(userId, name, age, groups)]
        const result = (await convertUserViewToGRPCDto(userQueryDto)).usersWithGroups

        expect(result[0].groups[0].groupname).toEqual(groups[0].groupName)
        expect(result[0].groups[0].groupId).toEqual(groups[0].groupId)
        expect(result[0].groups[0].userId).toEqual(groups[0].userId)
        expect(result[0].username).toEqual(name)
        expect(result[0].userId).toEqual(userId)
        expect(result[0].userage).toEqual(age)
    })

    it('getUserDtoWithGroupsFromQueryDto works corerectly without groups', async () => {
        const userQueryDto = [new UserQueryDto(userId, name, age)]
        const result = (await convertUserViewToGRPCDto(userQueryDto)).usersWithGroups;

        expect(result[0].groups.length).toEqual(0);
        expect(result[0].username).toEqual(name)
        expect(result[0].userId).toEqual(userId)
        expect(result[0].userage).toEqual(age)
    })
})