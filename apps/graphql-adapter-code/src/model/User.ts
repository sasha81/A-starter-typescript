import { Field, ID, ObjectType, Int, InputType } from '@nestjs/graphql';

@ObjectType({ description: 'user' })
export class User {
  @Field((type) => ID)
  userId: string;

  @Field()
  name: string; 

  @Field(() => Int)
  age: number;

}


