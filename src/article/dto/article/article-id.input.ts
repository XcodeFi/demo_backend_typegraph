import { Field, InputType } from "type-graphql";

@InputType()
export class ArticleIdInput {
  @Field(() => String)
  articleId: string;
}
