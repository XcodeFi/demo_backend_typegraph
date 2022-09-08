// import { IUser } from "src/user/models/users.model";
import "reflect-metadata";

import { graphqlUploadExpress } from "graphql-upload";
import { ApolloServer } from "apollo-server-express";
import * as Express from "express";

import * as cors from "cors";

import Container from "typedi";
import { ArgumentValidationError, buildSchema } from "type-graphql";
import * as Mongoose from "mongoose";
import path = require("path");
import * as http from "http";
import * as cookieParser from "cookie-parser";

// import varible
import {
  NODE_ENV,
  MONGO_URL,
  PORT,
  END_POINT,
  UPLOAD_PATH,
  ALLOWED_ORIGINS,
} from "./environments";

import { UserModel } from "./user/models/users.model";
import { authChecker } from "./auth/auth-checker";
// import { UserResolver } from "./user/users.resolver";
import { JwtConfext } from "./auth/JwtContext";
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from "apollo-server-core";
import express = require("express");
// import { GraphQLError } from "graphql";
// import { AuthResolver } from "./auth/auth.resolver";

Container.set({ id: "USER", factory: () => UserModel });

async function bootstrap() {
  require("dotenv").config(__dirname + ".env");

  const schema = await buildSchema({
    resolvers: [__dirname + "*/**/*.resolver.{ts,js}"],
    emitSchemaFile: path.resolve(__dirname, "schema.gql"),
    container: Container,
    authChecker: authChecker,
    dateScalarMode: "timestamp" // "timestamp" or "isoDate"
  });

  const app = Express();
  Mongoose.connect(MONGO_URL, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
    .then(async () => {
      console.log(`Mongodb: ${MONGO_URL} is connected successfully`);

      const httpServer = http.createServer(app);

      // Create GraphQL server
      const server = new ApolloServer({
        schema,

        // introspection: true,
        context: ({ req, res }) => {
          const ctx: JwtConfext = {
            // create mocked user in context
            // in real app you would be mapping user from `req.user` or sth
            req,
            res,
          };
          return ctx;
        },
        formatError: (err) => {
          // Don't give the specific errors to the client.
          if (err.message.startsWith("Database Error: ")) {
            return new Error("Internal server error");
          }

          if (err.message.startsWith("Argument Validation Error")) {
            const validationError = err!
              .originalError! as ArgumentValidationError;

            const x = validationError.validationErrors.map((t) => {
              const res: { [k: string]: string } = {
                [t.property]: Object.values(t.constraints!).join(", "),
              };

              return res;
            });

            return new Error(JSON.stringify(x));
          }

          // if (err as GraphQLError)
          // {
          //   const messageContent= err.message.split(';')[1];
          //   console.log(messageContent);
          //   return new Error(messageContent);
          // }

          return new Error(err.message);

          // Otherwise return the original error. The error can also
          // be manipulated in other ways, as long as it's returned.
          // return err;
        },
        plugins: [
          NODE_ENV === "production"
            ? ApolloServerPluginLandingPageProductionDefault({ footer: false })
            : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
        ],
      });

      // Mount a jwt or other authentication middleware that is run before the GraphQL execution
      // app.use(
      //   server.graphqlPath,
      //   jwt({
      //     secret: "TypeGraphQL",
      //     credentialsRequired: false,
      //   })
      // );

      // Add a list of allowed origins.
      // If you have more origins you would like to add, you can add them to the array below.
      // https://expressjs.com/en/resources/middleware/cors.html
      const corsOptionsDelegate = function (req: any, callback: any) {
        const defaultCorsOption = {
          methods: ["GET"],
          credentials: true,
        }
        let corsOptions: cors.CorsOptions;
        if (ALLOWED_ORIGINS.indexOf(req.header('Origin')) !== -1) {
          corsOptions = { origin: true, ...defaultCorsOption } // reflect (enable) the requested origin in the CORS response
        } else {
          corsOptions = { origin: false } // disable CORS for this request
        }
        callback(null, corsOptions) // callback expects two parameters: error and options
      }

      app.use(cookieParser("secret_cookie_key"))
      app.use(cors(corsOptionsDelegate)); // enable cors
      // publish image folder
      app.use(express.static(UPLOAD_PATH));
      app.use(`/${UPLOAD_PATH}`, express.static(UPLOAD_PATH));

      app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

      // app.use(function (req, res, next) {
      //   res.header('Access-Control-Allow-Origin', req.headers.origin);
      //   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
      //   res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
      //   next();
      // });

      await server.start();

      server.applyMiddleware({
        app,
        cors: false
      });

      await new Promise<void>((resolve) =>
        httpServer.listen({ port: PORT }, resolve)
      );
      console.log(`🚀 Server ready at http://localhost:${PORT}/${END_POINT}`);
    })
    .catch((err) => {
      console.log(err);
      console.log(MONGO_URL);
    });
}
bootstrap();
