import { Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../model/User';

@InputType()
export class CreateUserInput {
  @Field({ nullable: false })
    name: string; 

  @Field(() => Int)
  age: number;
}
@InputType()
export class UpdateUserInput {
  @Field((type) => ID)
  userId: string;

  @Field()
  name: string; 

  @Field(() => Int)
  age: number;
}


@ObjectType()
export class UserId{
    @Field((type) => ID)
    id: string;
}

