import { Entity } from '../../common/models/entity';
import { Schema, model } from "mongoose";

export const DOCUMENT_NAME = "OrderItem";
export const COLLECTION_NAME = "order_items";

export interface OrderItem extends Entity {
  product_name: string;
  product_sale_price: number;
  product_url_key: string; // URL key of the base product
  quantity_ordered: number; // The number of units ordered for this item
  status: number; // The status of the order item

  quantity_canceled?: number;
  quantity_refunded?: number;
  quantity_returned?: number;
  quantity_shipped?: number;
}

const schema = new Schema<OrderItem>(
  {
    product_name: {
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

export const OrderItemModel = model<OrderItem>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME
);
