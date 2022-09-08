import { Length } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType({ description: "Register Input object " })
export default class RegisterInputType   {
  // email | phone
  @Field()
  @Length(1, 30)
  // @IsEmail()
  // @IsPhoneNumber()
  username: string
  
  @Field()
  @Length(1, 30)
  password: string
}