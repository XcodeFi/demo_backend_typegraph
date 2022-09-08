import { ObjectIdScalar } from './../../../scalars/objectId';
import { ObjectId } from "mongoose";
import { ArgsType, Field } from "type-graphql";

@ArgsType()
export class ProductFilterInput {
  @Field({ nullable: true })
  urlSlug?: string;

  @Field(() => ObjectIdScalar, { nullable: true })
  id?: ObjectId;
}
