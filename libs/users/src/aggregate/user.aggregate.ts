import { AggregateRoot } from '@nestjs/cqrs';

export class UserAggregate extends AggregateRoot{
    private id : string;
    private name : string;
    private age : number;

    constructor(id: string, name: string, age: number) {
        super();
        this.id=id;
        this.name=name;
        this.age=age;
      }

      getId(){
        return this.id;
      }

      getName(){
        return this.name;
      }
      getAge(){
        return this.age;
      }
     
}

