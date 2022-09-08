import mongoose from "mongoose";
// import { Types } from "mongoose";
import { Schema, model } from "mongoose";
import { User } from "../../user/models/users.model";

export const DOCUMENT_NAME = "Article";
export const COLLECTION_NAME = "articles";

export interface Article {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  text?: string;
  draftText?: string;
  tags: string[];
  imgUrl?: string;
  blogUrl: string;
  likes?: number;
  score: number;
  isSubmitted: boolean;
  isDraft: boolean;
  isPublished: boolean;
  status?: boolean;
  publishedAt?: Date;
  createdBy?: User | mongoose.Types.ObjectId;
  updatedBy?: User | mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema(
  {
    title: {
      type: Schema.Types.String,
      required: true,
      maxlength: 500,
      trim: true,
    },
    description: {
      type: Schema.Types.String,
      required: true,
      maxlength: 2000,
      trim: true,
    },
    text: {
      type: Schema.Types.String,
      required: false,
      //select: false,
    },
    draftText: {
      type: Schema.Types.String,
      required: true,
      //select: false,
    },
    tags: [
      {
        type: Schema.Types.String,
        trim: true,
        uppercase: true,
      },
    ],
    imgUrl: {
      type: Schema.Types.String,
      required: false,
      maxlength: 500,
      trim: true,
    },
    blogUrl: {
      type: Schema.Types.String,
      required: true,
      unique: true,
      maxlength: 200,
      trim: true,
    },
    likes: {
      type: Schema.Types.Number,
      default: 0,
    },
    score: {
      type: Schema.Types.Number,
      default: 0.01,
      max: 1,
      min: 0,
    },
    isSubmitted: {
      type: Schema.Types.Boolean,
      default: false,
      //select: false,
      index: true,
    },
    isDraft: {
      type: Schema.Types.Boolean,
      default: true,
      //select: false,
      index: true,
    },
    isPublished: {
      type: Schema.Types.Boolean,
      default: false,
      //select: false,
      index: true,
    },
    publishedAt: {
      type: Schema.Types.Date,
      required: false,
      index: true,
    },
    status: {
      type: Schema.Types.Boolean,
      default: true,
      //select: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      // required: true,
      //select: false,
      index: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      //select: false,
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

// schema.virtual('id').get(function(this: {_id: Schema.Types.ObjectId}) {
//   return this._id;
// })
// .set(function(this: {_id: Schema.Types.ObjectId, id: Schema.Types.ObjectId}) {
//   this.id = this._id;
// });

// schema.virtual('id').get(function (this: { text: string }) {
//   return this.text + 'abc';
// });

export const ArticleModel = model<Article>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME
);