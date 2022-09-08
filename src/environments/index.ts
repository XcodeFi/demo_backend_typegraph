import * as dotenv from "dotenv";
dotenv.config();

// environment
const NODE_ENV: string = process.env.NODE_ENV || "development";
const ALLOWED_ORIGINS: string =
  process.env.ALLOWED_ORIGINS || "http://localhost:3000";

// application
// const PRIMARY_COLOR: string = process.env.PRIMARY_COLOR || '#87e8de'
const DOMAIN: string = process.env.DOMAIN || "localhost";
const PORT: number = +(process.env.PORT + "") || 14047;
const END_POINT: string = process.env.END_POINT || "graphql";
// const RATE_LIMIT_MAX: number = +(process.env.RATE_LIMIT_MAX +'') || 10000
// const GRAPHQL_DEPTH_LIMIT: number = +(process.env.GRAPHQL_DEPTH_LIMIT+'') || 3

// mlab
const MLAB_USER = process.env.MLAB_USER || "sa";
const MLAB_PASS = process.env.MLAB_PASS || "123";
const MLAB_HOST = process.env.MLAB_HOST || "cluster0.ihxxm.gcp.mongodb.net";
// const MLAB_PORT = +(process.env.MLAB_PORT+'') || 47420
const MLAB_DATABASE = process.env.MLAB_DATABASE || "green-van-db";
const MLAB_URL =
  process.env.MLAB_URL ||
  `mongodb+srv://${MLAB_USER}:${MLAB_PASS}@${MLAB_HOST}/${MLAB_DATABASE}?retryWrites=true&w=majority`;

// mongodb
// const MONGO_PORT: number = +(process.env.MONGO_PORT+'') || 27017
const MONGO_DB_NAME: string = process.env.MONGO_PORT
  ? "my-api-db"
  : MLAB_DATABASE;
const MONGO_URL: string = +(process.env.MONGO_PORT + "")
  ? `mongodb://localhost:${process.env.MONGO_PORT}/${MONGO_DB_NAME}`
  : MLAB_URL;

const MONGO_URL_TEST: string = +(process.env.MONGO_PORT + "")
  ? `mongodb://localhost:${process.env.MONGO_PORT}/unit-test-db}`
  : MLAB_URL;

const UPLOAD_PATH: string = process.env.UPLOAD_PATH ?? "static";

// bussiness
const CART_KEY_LENGHT: number = +(process.env.CART_KEY_LENGHT + "") ?? 30;

export {
  MONGO_URL_TEST,
  MONGO_DB_NAME,
  MONGO_URL,
  NODE_ENV,
  PORT,
  END_POINT,
  DOMAIN,
  UPLOAD_PATH,
  ALLOWED_ORIGINS,
  CART_KEY_LENGHT,
};
