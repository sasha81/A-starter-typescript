export class CreateUserCommand {
    constructor(
      public readonly name: string,
      public readonly age: number,
    ) {}
  }