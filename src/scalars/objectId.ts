import { GraphQLScalarType, Kind } from "graphql";
import mongoose from "mongoose";

export const ObjectIdScalar = new GraphQLScalarType({
    name: "ObjectId",
    description: "Mongo object id scalar type",
    serialize(value: unknown): string {
        // check the type of received value
        if (!(value instanceof mongoose.Types.ObjectId)) {
            throw new Error("ObjectIdScalar can only serialize ObjectId values");
        }
        return value.toHexString(); // value sent to the client
    },
    parseValue(value: unknown): mongoose.Types.ObjectId {
        // check the type of received value
        if (typeof value !== "string") {
            throw new Error("ObjectIdScalar can only parse string values");
        }
        return new mongoose.Types.ObjectId(value); // value from the client input variables
    },
    parseLiteral(ast): mongoose.Types.ObjectId {
        // check the type of received value
        if (ast.kind !== Kind.STRING) {
            throw new Error("ObjectIdScalar can only parse string values");
        }
        return new mongoose.Types.ObjectId(ast.value); // value from the client query
    },
});