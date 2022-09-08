import { Field, ID, ObjectType } from "type-graphql";
import { User } from "../../user/models/users.model";
import UserSchema from "../../user/schemas/user.schema";

@ObjectType({ description: "File Schema" })
export default class FileSchema {
  @Field(() => ID)
  id: String

  @Field()
  name: String;

  @Field()
  path: String;

  @Field(() => UserSchema)
  createdBy?: User;

  @Field()
  createdAt?: Date;
}