import { Service } from "typedi";
import { UserModel, User } from "./models/users.model";

@Service({ id: "user.service" })
export class UserService {
  constructor() {}

  async getAll() {
    return UserModel.find();
  }

  async getById(id: string): Promise<User | null> {
    return UserModel.findOne({ _id: id });
  }

  async getByUniqueField(
    email: string,
    phoneNumber: string
  ): Promise<User | null> {
    return UserModel.findOne({
      $or: [{ email: email }, { phoneNumber: phoneNumber }],
    }).lean<User>().exec();
  }

  async insertUser(userInfo: any): Promise<any> {
    const dateNow = new Date();
    const user = await UserModel.create({
      ...userInfo,
      createdAt: dateNow,
    });
    return user;
  }
}
