import { Schema, model } from "mongoose";
import mongoose from "mongoose";
import { User } from "../../user/models/users.model";
import { ProductStatusType } from "../enum/productStatusType";
import { Ref } from "~/types/ref";

export const DOCUMENT_NAME = "Product";
export const COLLECTION_NAME = "products";

export interface Product {
  _id: mongoose.Types.ObjectId,
  name: string;
  price: number;
  basePrice: number;
  categoryId: number; 
  description: string;
  quantity: number;
  tags: string[];
  imgUrls: string[];
  urlSlug: string;
  likes?: number;
  rating?: number;
  status: ProductStatusType; // -1: delete, 0: draft, 1: submitted, 2: reject, 3: publish
  createdBy?: Ref<User>;
  updatedBy?: Ref<User>;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      maxlength: 120,
      trim: true,
    },
    description: {
      type: Schema.Types.String,
      required: true,
      maxlength: 3000,
      trim: true,
    },
    price: {
      type: Schema.Types.Number,
      required: true,
    },
    basePrice: {
      type: Schema.Types.Number,
      required: true,
    },
    quantity: {
      type: Schema.Types.Number,
      required: true,
    },
    categoryId: {
      type: Schema.Types.Number,
      required: true,
    },
    tags: [
      {
        type: Schema.Types.String,
        trim: true,
        uppercase: true,
      },
    ],
    imgUrls: [{
      type: Schema.Types.String,
      required: false,
      maxlength: 500,
      trim: true,
    }],
    urlSlug: {
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
    rating: {
      type: Schema.Types.Number,
      default: 0.01,
      max: 1,
      min: 0,
    },
    status: {
      type: Schema.Types.Number,
      default: 0,
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
  { name: "text", description: "text" },
  { weights: { name: 3, description: 1 }, background: false }
);

export const ProductModel = model<Product>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME
);