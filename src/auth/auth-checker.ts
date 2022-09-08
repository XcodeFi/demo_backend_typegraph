import { verify } from "jsonwebtoken";
import { AuthChecker } from "type-graphql";
import { JWTPayload } from "./jwt-payload.interface";
import { JwtConfext } from "./JwtContext";

// create auth checker function
export const authChecker: AuthChecker<JwtConfext> = ({ context }) => {
  // if (roles.length === 0) {
  //   // if `@Authorized()`, check only if user exists
  //   return user !== undefined;
  // }
  // // there are some roles defined now

  // if (!user) {
  //   // and if no user, restrict access
  //   return false;
  // }

  //   if (user.roles.some(role => roles.includes(role))) {
  //     // grant access if the roles overlap
  //     return true;
  //   }

  const authorization = context.req.headers["authorization"];

  if (!authorization) {
    return false;
  }

  try {
    const token = authorization.split(" ")[1];
    const payload = verify(token, "MySecretKey");
    context.payload = payload as JWTPayload;

    return true;
  } catch (err) {
    console.log(err);
    throw new Error("Not authenticated");
  }
};
