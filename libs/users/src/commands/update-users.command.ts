


export class UpdateUserCommand {
    
    constructor(
      public readonly userId: string,public name: string, public age: number
     
    ) {
        this.userId = userId; this.name=name; this.age=age; 
    }
  }