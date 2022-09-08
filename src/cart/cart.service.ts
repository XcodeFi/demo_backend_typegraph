import { ShippingInput } from "./dto/shipping.input";
import { CartItem, CartItemModel } from "./models/cart.item.model";
import { Service } from "typedi";
import { CreateCartItemInput } from "./dto/create-cart.input";
import { Cart, CartModel } from "./models/cart.model";
import { User } from "~/user/models/users.model";
import { Ref } from "~/types/ref";
import { ShippingInfo, ShippingInfoModel } from "./models/shipping.model";
import { ProductModel } from "./../product/models/product.model";
import { randomKey } from '../utils';
import { CART_KEY_LENGHT } from "./../environments";

@Service()
export class CartsService {
  DEFAULT_PAGE_INDEX = 0;
  DEFAULT_PAGE_LIMIT = 10;

  constructor() { }

  async createCart(user: Ref<User> | null = null): Promise<Cart> {
    const cart = {
      cart_id: randomKey(CART_KEY_LENGHT),
      created_at: new Date(),
      created_by: user,
    } as Cart;

    const cartAdded = await CartModel.create(cart);

    return cartAdded;
  }

  async getCartByCartId(cart_id: string): Promise<Cart> {

    const cartObj = await CartModel.findOne({ cart_id });

    if (!cartObj) {
      throw new Error("Cart not found");
    }

    return cartObj;
  }

  async getCartInforById(cart_id: string): Promise<Record<string, any>> {

    // check cart exist
    const cart = await this.getCartByCartId(cart_id);

    const cart_items = await CartItemModel.find({ cart: cart._id }).populate('product').lean();
    const cart_shipping: ShippingInfo = await ShippingInfoModel.find({ cart: cart_id }).lean();

    return {
      items: cart_items,
      shipping_address: cart_shipping.shipping_address,
      shipping_time: cart_shipping.shipping_time,
      payment_method: cart_shipping.payment_method,
      note: cart_shipping.note
    }
  }

  async addProductsToCart(cartInput: CreateCartItemInput): Promise<CartItem[]> {
    var cart = await CartModel.findOne({ cart_id: cartInput.cart_id });

    if (!cart) throw new Error("Cart not found");

    var prod = await ProductModel.findOne({ urlSlug: cartInput.cart_items.urlSlug });

    if (!prod) throw new Error("Product not found");

    // add cartItem
    const item = {
      cart: cart._id,
      product: prod._id,
      quantity: cartInput.cart_items.quantity,
    } as CartItem;

    // update cart item if product already exist
    const findItem = await CartItemModel.findOne({ product: item.product, cart: item.cart });

    if (findItem) {
      findItem.quantity = item.quantity;
      findItem.updated_at = new Date();

      await CartItemModel.updateOne({ _id: findItem._id }, { quantity: item.quantity, updated_at: new Date() });
    } else {
      item.created_at = new Date();

      await CartItemModel.create(item);
    }

    // get all items belong cart with cart_id
    const allCartItems = await CartItemModel.find({ cart: cart._id }).populate('product').lean();

    return allCartItems;
  }

  async setShippingInfoOnCart(input: ShippingInput): Promise<ShippingInfo> {
    // check cart exist
    var cart = await CartModel.findOne({ cart_id: input.cart_id });

    if (!cart) throw new Error("Cart not found");

    // save to db
    const shippingInfo = {
      cart_id: cart._id,
      shipping_address: input.shipping_adress
        ? {
          ...input.shipping_adress,
        }
        : null,
      shipping_time: input.shipping_time
        ? {
          ...input.shipping_time,
          date: input.shipping_time!.date
            ? new Date(input.shipping_time.date)
            : null,
        }
        : null,
      payment_method: {
        ...input.payment_method,
      },
      created_at: new Date(),
    } as ShippingInfo;

    const shippingRs = await ShippingInfoModel.create(shippingInfo);

    return shippingRs;
  }
}
