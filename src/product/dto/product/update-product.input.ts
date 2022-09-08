import { InputType, Field, ID } from "type-graphql";
import mongoose from "mongoose";

@InputType()
export class UpdateProductInput {
  @Field(() => ID)
  _id: mongoose.Types.ObjectId;

  @Field()
  name: String;

  @Field()
  description: String;

  @Field()
  price: number;

  @Field()
  basePrice: number;

  // @Field()
  // sku: string;

  @Field()
  urlSlug: String;

  @Field(() => [String])
  imgUrls: String[];

  @Field()
  quantity: number;

  @Field()
  categoryId: number;
}
