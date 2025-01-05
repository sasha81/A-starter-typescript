import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends CreateUserDto {
    readonly userId: string;
    constructor( userId: string, name: string, age: number){
        super(name, age);
        this.userId = userId
    }
    
}
