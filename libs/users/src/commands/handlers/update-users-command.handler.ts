import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { UpdateUserCommand } from "../update-users.command";
import { Logger } from "@nestjs/common";
import { UserAggregateService } from "@libs/users/aggregate/user.aggregate.service";


@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler implements ICommandHandler<UpdateUserCommand> {
  private readonly logger = new Logger(UpdateUserCommandHandler.name);
  constructor(
    private readonly userAggregateService: UserAggregateService,
    private readonly publisher: EventPublisher,
  ) { }

  async execute(command: UpdateUserCommand): Promise<string> {

    const { userId, name, age } = command;
    const user = this.publisher.mergeObjectContext(
      await this.userAggregateService.update({ userId, name, age })
    );

    user.commit();

    return user.getId();
  }
}