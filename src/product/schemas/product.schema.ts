import { StockStatus } from "./../enum/productStatusType";
import { Field, ObjectType } from "type-graphql";
import { User } from "../../user/models/users.model";
import UserSchema from "../../user/schemas/user.schema";
// import User from "~/user/models/users.model";

@ObjectType({ description: "Product Schema" })
export class ProductSchema {
  // @Field(() => ID, { nullable: true })
  // _id: String;

  @Field({ nullable: true })
  name: String;

  @Field({ nullable: true })
  price: Number;

  @Field({ nullable: true })
  categoryId: Number;

  @Field({ nullable: true })
  description: String;

  @Field({ nullable: true, defaultValue: 0 })
  quantity: Number;

  @Field(() => [String], { nullable: true })
  imgUrls: String[];

  @Field({ nullable: true })
  urlSlug: String;

  @Field({ nullable: true })
  likes?: number;

  @Field({ nullable: true })
  rating: number;

  @Field({ nullable: true })
  status: Number;

  @Field({ nullable: true })
  get stock_status(): StockStatus {
    if (this.quantity > 0) {
      return StockStatus.in_stock;
    }

    return StockStatus.out_stock;
  }

  @Field(() => UserSchema, { nullable: true })
  createdBy?: User;
  // updatedBy?: User;
  @Field({ nullable: true })
  createdAt?: Date;
  // updatedAt?: Date;
}
