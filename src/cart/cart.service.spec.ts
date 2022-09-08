import { randomKey } from "./../utils/uuid/index";
// import mongoose from "mongoose";
import mongoose from "mongoose";
import { ProductStatusType } from "../product/enum/productStatusType";
import { ProductModel } from "../product/models/product.model";
import * as dbHandler from "../test/db";
import { CartsService } from "./cart.service";
import { CartItemInput, CreateCartItemInput } from "./dto/create-cart.input";
import {
  ShippingInput,
  PaymentMethodInput,
  ShippingAdressInput,
  ShippingTimeInput,
} from "./dto/shipping.input";
import { Cart, CartModel } from "./models/cart.model";
import { CART_KEY_LENGHT } from "./../environments";

beforeAll(async () => {
  await dbHandler.connect();
});

afterEach(async () => {
  await dbHandler.clearDatabase();
});

afterAll(async () => {
  await dbHandler.closeDatabase();
});

describe("cart service test", () => {
  const cartService = new CartsService();
  // const objectId = new mongoose.Types.ObjectId("56cb91bdc3464f14678934ca");

  it("can be created cart correctly", async () => {
    const rs = await cartService.createCart();

    // check that name is expected
    expect(rs).toBeDefined();
  });

  it("can be created cart correctly with user_id", async () => {
    var id = new mongoose.Types.ObjectId("56cb91bdc3464f14678934ca");

    const rs = await cartService.createCart(id);

    // check that name is expected
    expect(rs).toBeDefined();
  });

  it("can be add product to cart correctly", async () => {
    const { cart, prod } = await initData();

    const cartInput: CreateCartItemInput = {
      cart_items: {
        quantity: 1,
        urlSlug: prod.urlSlug,
      } as CartItemInput,
      cart_id: cart.cart_id,
    };

    const rs = await cartService.addProductsToCart(cartInput);

    // check exist data
    expect(rs[0]).toBeDefined();

    // check correct product id
    expect(rs[0].product).toBeDefined();
    expect(rs[0].product.urlSlug).toEqual("url_slug");
  });

  it("can be add product to cart should return error not found product", async () => {
    const { cart } = await initData();

    const cartInput: CreateCartItemInput = {
      cart_items: {
        quantity: 1,
        product_id: cart._id,
      } as CartItemInput,
      cart_id: cart.cart_id,
    };

    try {
      await cartService.addProductsToCart(cartInput);
    } catch (error) {
      // check exist data
      expect(error.message).toEqual("Product not found");
    }
  });
});

describe("setShippingInfoOnCart test: ", () => {
  const cartService = new CartsService();

  it("should return not found cart id", async () => {
    const objectId = randomKey(CART_KEY_LENGHT);

    const shippingInfo = {
      cart_id: objectId,
      shipping_adress: {
        name: "A",
        telephone: "0349649834",
        address: "14b, pham ngoc thach, dong da, ha noi",
      } as ShippingAdressInput,
      shipping_time: {
        date: Date.now(),
        from_hour: 13,
        to_hour: 15,
      } as ShippingTimeInput,
      payment_method: { code: "cash" } as PaymentMethodInput,
      note: "note",
    } as ShippingInput;

    try {
      await cartService.setShippingInfoOnCart(shippingInfo);
      // Fail test if above expression doesn't throw anything.
    } catch (e) {
      expect(e.message).toBe("Cart not found");
    }
    // check that name is expected
  });

  it("can be created correctly", async () => {
    const { cart } = await initData();

    const shippingInfo = {
      cart_id: cart.cart_id,
      shipping_adress: {
        name: "A",
        telephone: "0349649834",
        address: "14b, pham ngoc thach, dong da, ha noi",
      } as ShippingAdressInput,
      shipping_time: {
        date: Date.now(),
        from_hour: 13,
        to_hour: 15,
      } as ShippingTimeInput,
      payment_method: { code: "cash" } as PaymentMethodInput,
      note: "note",
    } as ShippingInput;

    const rs = await cartService.setShippingInfoOnCart(shippingInfo);

    // check that name is expected
    expect(rs).toBeDefined();
  });
});

const initData = async () => {
  const cart = {
    cart_id: randomKey(CART_KEY_LENGHT),
    created_at: new Date(),
  } as Cart;

  const cartAdded = await CartModel.create(cart);

  const productInput = {
    basePrice: 1,
    price: 1,
    name: "test_name",
    quantity: 1,
    description: "description",
    categoryId: 1,
    tags: [],
    imgUrls: [],
    urlSlug: "url_slug",
    status: ProductStatusType.draft,
    createdAt: new Date(),
  };

  var prod = await ProductModel.create(productInput);

  return {
    cart: cartAdded,
    prod,
  };
};
