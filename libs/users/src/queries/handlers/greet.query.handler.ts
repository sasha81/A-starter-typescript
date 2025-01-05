import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GreetQuery } from "../greet.query";
import { GreetException } from "@libs/users/exceptions/GreetException";

@QueryHandler(GreetQuery)
export class GreetQueryHandler implements IQueryHandler<GreetQuery> {

  async execute(query: GreetQuery): Promise<string> {

    //throw new GreetException()
    return 'Greet handler greets ' + query.name;
  }
}