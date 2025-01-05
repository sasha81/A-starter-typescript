export class CreateUserDto {
    constructor(name:string, age: number){
        this.name=name; this.age=age;
    }
    name: string;
    
    age: number
}
