import mongoose from "mongoose";
import { Field, InputType } from "type-graphql";
import { ObjectIdScalar } from "./../../scalars/objectId";
@InputType()
export class CartItemInput {
  @Field(() => ObjectIdScalar, { nullable: true })
  product_id: mongoose.Types.ObjectId;

  @Field({ nullable: true })
  urlSlug: string;

  @Field()
  quantity: number;
}

// https://github.com/typestack/class-validator
@InputType()
export class CreateCartItemInput {
  @Field({ nullable: true })
  cart_id: string;

  @Field(() => CartItemInput)
  cart_items: CartItemInput;
}