import { Entity } from './../../common/models/entity';
import { Schema, model } from "mongoose";

export const DOCUMENT_NAME = "Cart";
export const COLLECTION_NAME = "carts";

export interface Cart extends Entity {
  cart_id: string
}

const schema = new Schema<Cart>(
  {
    cart_id: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    created_at: {
      type: Date,
      required: true,
    },
    updated_at: {
      type: Date,
    },
  },
  {
    id: true,
    versionKey: false,
  }
).index(
  { name: "text", description: "text" },
  { weights: { name: 3, description: 1 }, background: false }
);

export const CartModel = model<Cart>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME
);
