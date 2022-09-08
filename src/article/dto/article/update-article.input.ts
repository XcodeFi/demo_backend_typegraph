import { InputType, Field, ID } from "type-graphql";
import mongoose from "mongoose";

@InputType()
export class UpdateArticleInput {
  @Field(() => ID)
  id: mongoose.Types.ObjectId;

  @Field()
  title: String;

  @Field({nullable:true})
  text?: String;

  @Field()
  blogUrl: String;
}
