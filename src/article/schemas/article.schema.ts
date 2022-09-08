import { Field, ID, ObjectType } from "type-graphql";
import { User } from "../../user/models/users.model";
import UserSchema from "../../user/schemas/user.schema";
// import User from "~/user/models/users.model";

@ObjectType({ description: "Article Schema" })
export default class ArticleSchema {
  @Field(() => ID)
  id: String

  @Field()
  title: String;

  @Field()
  description: String;

  @Field()
  text?: String;

  @Field()
  draftText?: String;

  @Field(() => [String])
  tags: String[];

  @Field()
  imgUrl?: String;

  @Field()
  blogUrl: String;

  @Field()
  likes?: number;

  @Field()
  score: number;

  @Field()
  isSubmitted: boolean;



  // @Field()
  // isDraft: boolean;
  // isPublished: boolean;
  // status?: boolean;
  // publishedAt?: Date;
  @Field(() => UserSchema)
  createdBy?: User;
  // updatedBy?: User;
  @Field()
  createdAt?: Date;
  // updatedAt?: Date;
}