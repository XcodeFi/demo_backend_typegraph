import { Field, InputType, Int } from "type-graphql";

@InputType()
export class PaginationArgs {
  @Field(() => Int)
  page?: number;

  @Field(() => Int)
  
  pageSize?: number;
}
