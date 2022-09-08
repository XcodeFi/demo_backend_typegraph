import * as mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MONGO_URL_TEST } from "../environments";

const mongod = new MongoMemoryServer();

/**
 * Connect to mock memory db.
 */
export const connect = async () => {
  const uri = MONGO_URL_TEST;

  // const mongooseOpts = {
  //     useNewUrlParser: true,
  //     autoReconnect: true,
  //     reconnectTries: Number.MAX_VALUE,
  //     reconnectInterval: 1000,
  //     poolSize: 10,
  // } as mongoose.ConnectOptions;

  await mongoose.connect(uri, {});
};

/**
 * Close db connection
 */
export const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
};

/**
 * Delete db collections
 */
export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

export const dbHandleInit = () => {
  beforeAll(async () => {
    await connect();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });
};
