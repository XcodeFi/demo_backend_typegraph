import { FileUpload, GraphQLUpload } from "graphql-upload";
import { Field, InputType } from "type-graphql";

@InputType()
export class CreateArticleInput {
  @Field()
  title: String;

  @Field()
  description: String;

  @Field()
  text?: String;

  @Field()
  blogUrl: String;

  @Field(()=>[String])
  tags: String[];

  @Field(() => GraphQLUpload)
  readonly image?: FileUpload;
}
