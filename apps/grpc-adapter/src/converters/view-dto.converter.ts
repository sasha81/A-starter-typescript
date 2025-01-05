import { UserQueryDto } from "@libs/users/queries/query-dto/read-users.dto";
import { CreateUserDto as CreateUserGRPC, User as UpdateUserGRPC, Group, UsersWithGroupsDto } from "../from-proto/users";
import { CreateUserDto } from "@libs/users/commands/command-dto/create-user.dto";
import { UpdateUserDto } from "@libs/users/commands/command-dto/update-user.dto";

export const convertUserViewToGRPCDto = (userViews: UserQueryDto[]): Promise<UsersWithGroupsDto> => {
    return new Promise((resolve) => {
        const result = userViews.map(user => {
            const grps: Group[] = user.groups ? user.groups.map(gr => ({
                groupId: gr.groupId,
                groupname: gr.groupName,
                userId: gr.userId,
                groupstatus: gr.groupStatus,
                userstatus: gr.userStatus
            })) : []
            return { userId: user.userId, username: user.name, userage: user.age, groups: grps }
        });
        resolve({ usersWithGroups: result })
    });
};

export const convertGRPCCreateUserDtoToCreateUserDto = (grpcUserDto: CreateUserGRPC): CreateUserDto => {
    return { name: grpcUserDto.username, age: grpcUserDto.userage }
};
export const convertGRPCUpdateUserDtoToUpdateUserDto = (grpcUserDto: UpdateUserGRPC): UpdateUserDto => {
    return { userId: grpcUserDto.userId, name: grpcUserDto.username, age: grpcUserDto.userage }
}