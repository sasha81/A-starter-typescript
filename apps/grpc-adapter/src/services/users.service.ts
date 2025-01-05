import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';


import { User, CreateUserDto, UpdateUserDto, Users, PaginationDto } from '../from-proto/auth_old'
import { randomUUID } from 'crypto';
import { Observable, Subject, retry } from 'rxjs';
import { UsersNotFoundException } from '@libs/users/exceptions/UserNotFoundException';


//An auxilary stub service to emulate a response of the auth.proto (NOT user.proto)
@Injectable()
export class UsersService implements OnModuleInit {
  onModuleInit() {
    for (let i = 0; i <= 3; i++) {
      this.create({
        username: randomUUID(),
        password: randomUUID(),
        age: 15
      })
    }
  }
  private readonly users: User[] = [];


  create(createUserDto: CreateUserDto) {
    const user: User = {
      ...createUserDto,
      subscribed: false,
      socialMedia: {
        twitterUri: 'abc',
        fbUri: 'cde'
      },
      id: randomUUID()
    }
    this.users.push(user);
    return user;
  }

  findAll(): Users {
    //throw new UsersNotFoundException();
    return { user: this.users }
  }

  findOne(id: string): User {
    const user = this.users.find(user => user.id === id)
    if (user) {
      return user
    }
    throw new NotFoundException(`User ${id} not found`)

  }

  update(id: string, updateUserDto: UpdateUserDto): User {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      this.users[userIndex] = {
        ...this.users[userIndex],
        ...updateUserDto
      }
      return this.users[userIndex];
    }
    throw new NotFoundException(`User ${id} not found`)
  }

  remove(id: string) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      return this.users.splice(userIndex)[0];
    }
    throw new NotFoundException(`User ${id} not found`);
  }

  queryUsers(PaginationDtoStream: Observable<PaginationDto>): Observable<Users> {
    const subject = new Subject<Users>();
    const onNext = (paginationDto: PaginationDto) => {
      const start = paginationDto.page * paginationDto.skip;
      subject.next({
        user: this.users.slice(start, start + paginationDto.skip)
      })
    }

    const onComplete = () => subject.complete();
    PaginationDtoStream.subscribe({
      next: onNext,
      complete: onComplete
    });
    return subject.asObservable();
  }
}


