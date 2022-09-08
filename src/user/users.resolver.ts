import { Service } from "typedi";
import { Authorized, Ctx, Query, Resolver } from "type-graphql";
import UserSchema from "./schemas/user.schema";
import { JwtConfext } from "../auth/JwtContext";

@Resolver(() => UserSchema)
@Service()
export class UserResolver {
  constructor(
  
  ) {}

  @Authorized()
  @Query(() => String)
  sample(@Ctx() { payload }: JwtConfext): String {
    console.log(payload);
    return "Hello";
  }

  @Query(() => String)
  async checkActive(): Promise<String> {
    // fetching data
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('Call api ok')
      }, 2000);
    });
  }

  @Mutation(() => UserSchema)
  async registerUser(
    @Arg("username") username: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<User> {
    const existUser = await this.userService.getByEmail(email);

    if (existUser) {
      throw new Error("User with email already exists!");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await this.userService.insertUser({
      username,
      email,
      password: hashedPassword,
    });

    return user;
  }
}

