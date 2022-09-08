import * as bcrypt from "bcrypt";
import { GraphQLError } from "graphql";
import { JWTTokenResponseType } from "../user/dto/login.dto";
import { Service } from "typedi";

import * as jwt from "jsonwebtoken";
import { UserModel, User } from "../user/models/users.model";

@Service("auth.service")
export class AuthService {
  constructor() { }

  async createPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async verifyPassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  async validateUser(userName: string, password: string): Promise<User | null> {
    const user = await UserModel.findOne({ $or: [{ email: userName }, { phoneNumber: userName }] }).lean<User>();

    if (user) {

      const isPasswordVerified = await this.verifyPassword(
        password,
        user.password
      );

      if (isPasswordVerified) {
        return user;
      }
    }

    return null;
  }

  async loginUser(
    userName: string,
    password: string
  ): Promise<JWTTokenResponseType> {
    const user = await this.validateUser(userName, password);
    if (!user) {
      throw new GraphQLError("User Credentials are wrong !");
    }
    try {
      const token = jwt.sign(
        {
          id: (user as any)._id,
          username: user.displayName,
        },
        "MySecretKey",
        {
          expiresIn: "1y",
        }
      );
      return { token, success: true, user: user };
    } catch (e) {
      return { success: false };
    }
  }
}
