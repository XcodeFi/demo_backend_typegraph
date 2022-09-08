import { Field, ObjectType } from "type-graphql";
import { Product } from "~/product/models/product.model";
import { ProductSchema } from "../../product/schemas/product.schema";

@ObjectType({ description: "Cart item Schema" })
export default class CartItemSchema {
  @Field(() => ProductSchema, { nullable: true })
  product: Product;

  @Field({ nullable: true })
  quantity: Number;
}
