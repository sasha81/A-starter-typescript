import { Injectable, Logger } from "@nestjs/common";
import { CreateUserDto } from "../commands/command-dto/create-user.dto";
import { UserAggregate } from "./user.aggregate";
import { UserCommandMongoDBRepository } from "../users-mongodb/repositories/users.command.mongodb.repository";
import { UserCreatedEvent } from "../events/user-created.event";
import { randomUUID } from "node:crypto";
import { EventBus } from "@nestjs/cqrs";
import { UsersAggregateNotCreatedException, UsersAggregateNotUpdatedException } from "../exceptions/UserNotFoundException";
import { IMongoUser } from "../users-mongodb/entities/users-mongodb.entity";



@Injectable()
export class UserAggregateService {
  private readonly logger = new Logger(UserAggregateService.name);
  constructor(private userCommandMongoDbRepo: UserCommandMongoDBRepository,
    private eventBus: EventBus

  ) { }

  async create(createUserDto: CreateUserDto): Promise<UserAggregate> {
    const { name, age } = createUserDto;
    const userId = randomUUID()
    try {
      const createdUser = await this.userCommandMongoDbRepo.create({ userId, name, age })

      const userAggr = new UserAggregate(createdUser.userId, createdUser.name, createdUser.age)
      userAggr.apply(new UserCreatedEvent(userAggr.getId(), userAggr.getName(), userAggr.getAge()))

      return userAggr;
    }
    catch (e) {
      throw new UsersAggregateNotCreatedException(name)
    }
  }

  async update(userToUpdate: IMongoUser): Promise<UserAggregate> {
    const { userId, name } = userToUpdate
    try {
      const updatedUser = await this.userCommandMongoDbRepo.updateOne(userToUpdate);
      const userAggr = new UserAggregate(updatedUser.userId, updatedUser.name, updatedUser.age)
      userAggr.apply(new UserCreatedEvent(userAggr.getId(), userAggr.getName(), userAggr.getAge()))
      return userAggr
    }
    catch (e) {
      throw new UsersAggregateNotUpdatedException(name, userId)
    }

  }
}

