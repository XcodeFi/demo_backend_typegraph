import { JwtConfext } from "~/auth/JwtContext";
import { createParamDecorator } from "type-graphql";
import { User } from "~/user/models/users.model";

export default function CurrentUser() {
  return createParamDecorator<JwtConfext>(({ context }) => {

    const user = {
      _id: context.payload?.id,
      displayName: context.payload?.username,
    } as User;

    return user;
  });
}