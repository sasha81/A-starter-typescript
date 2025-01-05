export class GroupUserInfo {
    readonly userId: string;
    readonly userStatus: boolean;
}

export class GlobalGroupUpdatedEvent {
    readonly groupId: string;
    readonly groupName: string;
    readonly groupStatus: boolean;
    readonly userIds: GroupUserInfo[];


}