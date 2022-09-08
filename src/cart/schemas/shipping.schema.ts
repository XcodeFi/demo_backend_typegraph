
import { Field, Int, ObjectType } from "type-graphql";
import { PaymentMethod, ShippingAddress, ShippingTime } from '../models/shipping.model';

@ObjectType()
export class ShippingAdressSchema {
  @Field({ nullable: true })
  name: String;
  @Field({ nullable: true })
  telephone: String;
  @Field({ nullable: true })
  address: String;
}

@ObjectType()
export class ShippingTimeSchema {
  @Field({ nullable: true })
  date: Date;
  @Field(() => Int, { nullable: true })
  from_hour: Number;
  @Field(() => Int, { nullable: true })
  to_hour: Number;
}

@ObjectType()
export class PaymentMethodSchema {
  @Field({ nullable: true })
  code: String;
}

@ObjectType({ description: "Shipping cart Schema" })
export default class ShippingInfoSchema {
  @Field(() => ShippingAdressSchema, { nullable: true })
  shipping_address: ShippingAddress;

  @Field(() => ShippingTimeSchema, { nullable: true })
  shipping_time: ShippingTime;

  @Field(() => PaymentMethodSchema, { nullable: true })
  payment_method: PaymentMethod;

  @Field({ nullable: true })
  note: String;
}
