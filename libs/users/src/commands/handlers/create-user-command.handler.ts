
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../create-user.command';
import { Logger } from '@nestjs/common';
import { UserAggregateService } from '@libs/users/aggregate/user.aggregate.service';


@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  private readonly logger = new Logger(CreateUserHandler.name);
  constructor(
    private readonly userAggregateService :UserAggregateService,
    private readonly publisher: EventPublisher,
  ) {} 

  async execute(command: CreateUserCommand):Promise<string> {
   
    const { name, age } = command;
    const user = this.publisher.mergeObjectContext(
      await this.userAggregateService.create({name,age})    
    );
   
    user.commit();
   
    return user.getId();
  }
}