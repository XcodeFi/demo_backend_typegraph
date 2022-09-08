import { Entity } from '../../common/models/entity';
import { Schema, model } from "mongoose";

export const DOCUMENT_NAME = "Order";
export const COLLECTION_NAME = "orders";

export interface Order extends Entity {
  order_number: string;
}

const schema = new Schema<Order>(
  {
    order_number: {
      type: String,
      required: true,
      unique: true
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

export const OrderModel = model<Order>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME
);
