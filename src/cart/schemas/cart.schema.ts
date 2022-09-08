import { Field, ObjectType } from "type-graphql";
import CartItemSchema from "./cart.item.schema";
import { CartItem } from "../models/cart.item.model";
import ShippingInfoSchema from "./shipping.schema";

@ObjectType({ description: "Cart Schema" })
export default class CartSchema extends ShippingInfoSchema {
  @Field(() => [CartItemSchema], { nullable: true })
  items?: CartItem[];
}
