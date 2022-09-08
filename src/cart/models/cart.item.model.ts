import { Entity } from "./../../common/models/entity";
import { Schema, model } from "mongoose";
import { Ref } from "~/types/ref";
import {
  Product,
  DOCUMENT_NAME as Product_DOCUMENT_NAME,
} from "../../product/models/product.model";
import { Cart, DOCUMENT_NAME as Cart_DOCUMENT_NAME } from "./cart.model";

export const DOCUMENT_NAME = "CartItem";
export const COLLECTION_NAME = "cartItems";

export interface CartItem extends Entity {
  quantity: number;
  product: Ref<Product>;
  cart: Ref<Cart>;
}

const schema = new Schema<CartItem>(
  {
    cart: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: Cart_DOCUMENT_NAME,
    },
    quantity: {
      type: Number,
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: Product_DOCUMENT_NAME,
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

schema.post("save", function (doc, next) {
  doc.populate("product").then(function () {
    next();
  });
});

export const CartItemModel = model<CartItem>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME
);
