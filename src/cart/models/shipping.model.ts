import { Entity } from './../../common/models/entity';
import { Schema, model } from "mongoose";
import mongoose from "mongoose";
import { Ref } from "~/types/ref";
import { Cart } from "./cart.model";

export const DOCUMENT_NAME = "ShippingInfo";
export const COLLECTION_NAME = "shippingInfo";

export interface ShippingAddress {
  name: String;
  telephone: String;
  address: String;
}

export interface ShippingTime {
  date?: Date;
  from_hour?: number;
  to_hour?: number;
}

export interface PaymentMethod {
  code: String;
}

export interface ShippingBasic extends Entity {
  cart_id: Ref<Cart>;

  is_checkout: boolean;
  is_shipping: boolean; // either ship to custommer or not
  note: string;
  shipping_status: number;
}

export interface ShippingInfo extends ShippingBasic {
  shipping_address: ShippingAddress;
  shipping_time: ShippingTime;
  payment_method: PaymentMethod;
}

const shippingTimeSchema = new Schema<ShippingTime>({
  date: {
    type: Date,
  },
  from_hour: {
    type: Number,
  },
  to_hour: { type: Number },
});

const shippingAddressSchema = new Schema<ShippingAddress>({
  name: {
    type: String,
  },
  telephone: {
    type: String,
  },
  address: { type: String },
});

const schema = new Schema<ShippingInfo>(
  {
    cart_id: {
      type: mongoose.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    shipping_address: {
      type: shippingAddressSchema,
      default: () => ({}),
    },
    shipping_time: {
      type: shippingTimeSchema,
      default: () => ({}),
    },
    payment_method: {
      code: {
        type: String,
        required: true,
      },
    },
    is_checkout: {
      type: Boolean,
      default: false
    },
    note: {
      type: String
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User"
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

export const ShippingInfoModel = model<ShippingInfo>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME
);
