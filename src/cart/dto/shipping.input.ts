import { Field, InputType, Int } from "type-graphql";
@InputType()
export class ShippingAdressInput {
  @Field()
  name: String;
  @Field()
  telephone: String;
  @Field()
  address: String;
}

@InputType()
export class ShippingTimeInput {
  @Field({ nullable: true })
  date?: number;
  @Field(() => Int, { nullable: true })
  from_hour?: number;
  @Field(() => Int, { nullable: true })
  to_hour?: number;
}

@InputType()
export class PaymentMethodInput {
  @Field()
  code: String;
}

// https://github.com/typestack/class-validator
@InputType()
export class ShippingInput {
  @Field({ nullable: true })
  cart_id: string;

  @Field(() => ShippingAdressInput, { nullable: true })
  shipping_adress: ShippingAdressInput;

  @Field(() => ShippingTimeInput, { nullable: true })
  shipping_time: ShippingTimeInput;

  @Field(() => PaymentMethodInput, { nullable: true })
  payment_method: PaymentMethodInput;

  @Field()
  note: String;
}
