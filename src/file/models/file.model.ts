import { ObjectId } from "mongoose";
import { Schema, model } from "mongoose";
import { User } from "../../user/models/users.model";

export const DOCUMENT_NAME = "File";
export const COLLECTION_NAME = "files";

export interface File {
  _id: ObjectId,
  name: string;
  path: string;
  createdBy?: User | ObjectId;
  updatedBy?: User | ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      maxlength: 500,
      trim: true,
    },
    path: {
      type: Schema.Types.String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
      required: true,
      select: true
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    id: true,
    versionKey: false,
    // toJSON:{
    //   virtuals: true,
    // },
    // toObject: {
    //   getters: true
    // }
  }
).index(
  { title: "text", description: "text" },
  { weights: { title: 3, description: 1 }, background: false }
);

export const FileModel = model<File>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME
);