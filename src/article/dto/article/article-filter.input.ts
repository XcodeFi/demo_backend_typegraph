import { ObjectId } from "mongoose";
import { Field, InputType } from "type-graphql";

@InputType()
export class ArticleFilterInput {
  @Field({ nullable: true })
  slug?: string;

  @Field(() => String, { nullable: true })
  id?: ObjectId;
}
