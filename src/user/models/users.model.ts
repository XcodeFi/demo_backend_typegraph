import mongoose, { model, Schema } from 'mongoose';

export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'users';

export interface User {
  _id: mongoose.Types.ObjectId;
  displayName: string;
  email: string;
  phoneNumber: string;
  password: string;
  profilePicUrl?: string;
  // roles: Role[];
  verified?: boolean;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<User>(
  {
    displayName: {
      type: Schema.Types.String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: Schema.Types.String,
      trim: true,
    },
    phoneNumber: {
      type: Schema.Types.String,
      trim: true,
    },
    password: {
      type: Schema.Types.String,
    },
    profilePicUrl: {
      type: Schema.Types.String,
      trim: true,
    },
    // roles: {
    //   type: [
    //     {
    //       type: Schema.Types.ObjectId,
    //       ref: 'Role',
    //     },
    //   ],
    //   required: true,
    //   //select: false,,
    // },
    verified: {
      type: Schema.Types.Boolean,
      default: false,
    },
    status: {
      type: Schema.Types.Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    versionKey: false,
  },
);

export const UserModel = model<User>(DOCUMENT_NAME, schema, COLLECTION_NAME);
