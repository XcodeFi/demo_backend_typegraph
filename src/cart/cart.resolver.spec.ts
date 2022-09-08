import { randomKey } from './../utils/uuid/index';
import { gCall } from "./../test/graphqlInit";
import { clearDatabase, closeDatabase, connect } from "../test/db";
import { Cart, CartModel } from "./models/cart.model";
import { ProductStatusType } from "./../product/enum/productStatusType";
import { ProductModel } from "./../product/models/product.model";
import { CART_KEY_LENGHT } from './../environments';

beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

describe("cart resolve test for create cart for guest", () => {
  const mutation = `mutation CreateEmptyCart {
                                createEmptyCart
                             }`;

  it("should return string: [ok]", async () => {
    const result = await gCall({
      source: mutation,
      variableValues: {},
    });

    expect(result.data!.createEmptyCart).toBeDefined();
    expect(result.errors).toBeUndefined();
  });
});

describe("[cart resolve] test for create cart for user", () => {
  const mutation = `mutation CustomerCart {
                      customerCart
                    }`;

  it("should return new cart id", async () => {
    const result = await gCall({
      source: mutation,
      variableValues: {},
      userId: "56cb91bdc3464f14678934ca",
    });

    expect(result.data!.customerCart).toBeDefined();
    expect(result.errors).toBeUndefined();
  });
});

describe("cart resolve test for add new product to cart", () => {
  const mutation = `mutation AddProductsToCart($input: CreateCartItemInput!) {
                      addProductsToCart(input: $input) {
                        quantity
                        product {
                          name
                          stock_status
                        }
                      }
                    }`;

  it("should return data", async () => {
    const { cart, prod } = await init();

    const request = {
      cart_id: cart?.cart_id,
      cart_items:
        {
          urlSlug: prod?.urlSlug,
          quantity: 1,
        },
    };

    const result = await gCall({
      source: mutation,
      variableValues: {
        input: request,
      },
      userId: "56cb91bdc3464f14678934ca",
    });

    if (!result.data){
      console.log(result.data);
    }

    expect(result.data!.addProductsToCart).toBeDefined();
    expect(result.errors).toBeUndefined();
  });

  it("should return error", async () => {
    const request = {
      cart_id: "56cb91bdc3464f14678934ca",
      cart_items:
        {
          product_id: "56cb91bdc3464f14678934ca",
          quantity: 1,
        },
    };

    const result = await gCall({
      source: mutation,
      variableValues: {
        input: request,
      },
      userId: "56cb91bdc3464f14678934ca",
    });

    expect(result.data).toBeNull();
    expect(result.errors).toBeDefined();
  });
});

describe("cart resolve test for add shipping infor on cart", () => {
  const mutation = `mutation Mutation($input: CreateShippingInput!) {
                      setShippingInfoOnCart(input: $input) {
                        cart_id
                        shipping_address {
                          name
                          telephone
                          address
                        }
                        shipping_time {
                          date
                          from_hour
                          to_hour
                        }
                        payment_method {
                          code
                        }
                        note
                      }
                    }`;

  it("should success", async () => {

    const { cart } = await init();

    const request = {
      cart_id: cart.cart_id,
      shipping_adress: {
        name: "A",
        telephone: "0349649834",
        address: "b14, pham ngoc thach, dong da, ha noi",
      },
      shipping_time: {
        to_hour: 15,
        from_hour: 17,
        date: Date.now(),
      },
      payment_method: {
        code: "cash",
      },
      note: "note",
    };

    const result = await gCall({
      source: mutation,
      variableValues: {
        input: request,
      },
      userId: "56cb91bdc3464f14678934ca",
    });

    expect(result.data).toBeUndefined();
    expect(result.errors).toBeDefined();
  });
});

async function init() {
  let obj = {
    created_at: new Date(),
    cart_id: randomKey(CART_KEY_LENGHT)
  } as Cart;

  const cart = await CartModel.create(obj);

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

  const prod = await ProductModel.create(productInput);

  return {
    cart,
    prod
  };
}
