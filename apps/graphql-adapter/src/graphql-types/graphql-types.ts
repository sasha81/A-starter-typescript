
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface CreateUserInput {
    name: string;
    age: number;
}

export interface UpdateUserInput {
    userId: string;
    name: string;
    age: number;
}

export interface IQuery {
    getAllUsers(): Nullable<Nullable<UserViewDto>[]> | Promise<Nullable<Nullable<UserViewDto>[]>>;
}

export interface IMutation {
    createUser(input: CreateUserInput): User | Promise<User>;
    updateUser(input: UpdateUserInput): User | Promise<User>;
}

export interface User {
    userId: string;
    name: string;
    age: number;
}

export interface UserViewDto {
    userId: string;
    name: Nullable<string>;
    age: Nullable<number>;
    groups?: Nullable<Nullable<Group>[]>;
}

export interface Group {
    groupId: string;
    groupName?: Nullable<string>;
    groupStatus?: Nullable<boolean>;
    userId?: Nullable<string>;
    userStatus?: Nullable<boolean>;
}

export interface UserId {
    id?: Nullable<string>;
}

type Nullable<T> = T | null;
