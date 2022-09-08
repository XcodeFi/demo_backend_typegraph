import { User } from "src/user/models/users.model";

export interface Context {
  user?: User;
  userModel: any
}