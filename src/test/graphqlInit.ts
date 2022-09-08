import { CartsResolver } from './../cart/cart.resolver';
import { ProductsResolver } from "./../product/product.resolver";
import { buildSchema, Maybe } from "type-graphql";
import Container from "typedi";
import { authChecker } from "../auth/auth-checker";
import path = require("path");
import { graphql, GraphQLSchema } from "graphql";

export const createSchema = (isAuth: boolean = false) =>
  buildSchema({
    resolvers: [ProductsResolver, CartsResolver],
    emitSchemaFile: path.resolve(__dirname, "schema.gql"),
    container: Container,
    authChecker: isAuth ? authChecker : () => true,
  });

interface Options {
  source: string;
  variableValues?: Maybe<{
    [key: string]: any;
  }>;
  userId?: string;
  isAuth?: boolean
}

let schema: GraphQLSchema;

export const gCall = async ({ source, variableValues, userId, isAuth }: Options) => {
  if (!schema) {
    schema = await createSchema(isAuth);
  }
  return graphql({
    schema,
    source,
    variableValues,
    contextValue: {
      req: {
        session: { 
          userId,
        },
      },
      payload:{
        id: userId
      },
      res: {
        clearCookie: jest.fn(),
      },
    },
  });
};
