import { Field, ObjectType } from "type-graphql"
import { IsEmail, IsPhoneNumber, Length } from "class-validator"

@ObjectType({ description: "User Schema" })
export default class UserSchema {
  @Field({ nullable: true })
  @Length(1, 30)
  displayName: String

  @Field({ nullable: true })
  @IsEmail()
  @Length(1, 30)
  email?: String

  @Field({ nullable: true })
  @IsPhoneNumber()
  @Length(10, 12)
  phoneNumber?: String

  password: String

  @Field({ nullable: true })
  profilePicUrl?: String;
}