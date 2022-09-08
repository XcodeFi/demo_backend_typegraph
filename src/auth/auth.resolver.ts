import { JWTTokenResponseType, LoginInputType } from "../user/dto/login.dto";
import { Arg, Mutation, Resolver } from "type-graphql";
import { Inject, Service } from "typedi";
import { AuthService } from "./auth.service";
import RegisterInputType from "./../user/dto/register.dto";
import { UserService } from "./../user/users.service";
import { isVNPhoneNumber } from "../utils";
import { User } from "~/user/models/users.model";
import * as bcrypt from 'bcrypt';

@Resolver(() => JWTTokenResponseType)
@Service()
export class AuthResolver {
  constructor(
    @Inject("auth.service")
    private readonly authService: AuthService,
    @Inject("user.service")
    private readonly userService: UserService,
  ) { }

  @Mutation(() => JWTTokenResponseType, {
    description: "login using email/password to obtain a JWT token",
  })
  async login(
    @Arg("input") user: LoginInputType,
  ): Promise<JWTTokenResponseType> {
    
    return this.authService.loginUser(user.username, user.password);
  }

  @Mutation(() => JWTTokenResponseType)
  async registerUser(@Arg("input") input: RegisterInputType): Promise<JWTTokenResponseType> {
    const existUser = await this.userService.getByUniqueField(
      input.username,
      input.username
    );

    const isNumber = isVNPhoneNumber(input.username);

    if (existUser) {
      let message = isNumber
        ? "User with phone number already exists!"
        : "User with email already exists!";
      throw new Error(message);
    }

    const hashedPassword = await bcrypt.hash(input.password, 12);

    // #hardcode
    const profilePicUrl = "https://source.unsplash.com/random/1920x1080";

    await this.userService.insertUser({
      displayName: input.username,
      email: !isNumber ? input.username : null,
      phoneNumber: isNumber ? input.username : null,
      password: hashedPassword,
      profilePicUrl,
    } as User);

    return await this.authService.loginUser(input.username, input.password);
  }
}
