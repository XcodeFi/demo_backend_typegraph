import { Field, InputType } from "type-graphql";

@InputType()
export class ProductIdInput {
  @Field(() => String)
  productId: string;
}
