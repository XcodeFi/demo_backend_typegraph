import { Field, ID, ObjectType } from "type-graphql";
import { User } from "~/user/models/users.model";
import UserSchema from "~/user/schemas/user.schema";

@ObjectType({ description: "Comment Schema" })
export default class ArticleSchema {
  @Field(() => ID)
  id: String

  @Field()
  body: String;

  // @Field()
  // isDraft: boolean;
  // isPublished: boolean;
  // status?: boolean;
  // publishedAt?: Date;
  @Field(() => UserSchema)
  createdBy?: User;
  // updatedBy?: User;
  // createdAt?: Date;
  // updatedAt?: Date;
}