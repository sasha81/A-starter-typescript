import { Field, ID, Int, ObjectType } from "@nestjs/graphql";



@ObjectType()
export class Group{
    @Field((type) => ID)
    groupId: string;

    @Field(() => String)
    groupName: string;
    @Field(() => Boolean)
    groupStatus: boolean;
    @Field(() => String)
    userId: string;

    @Field(() => Boolean)
    userStatus: boolean;
}
@ObjectType()
export class UserViewDto{
    @Field((type) => ID)
  userId: string;

  @Field()
  name: string; 

  @Field(() => Int)
  age: number;
  @Field((type) => [Group])
  groups:  Group[]
}