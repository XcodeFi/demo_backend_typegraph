import ShippingInfoSchema from "./schemas/shipping.schema";
import { ShippingInfo } from "./models/shipping.model";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Inject, Service } from "typedi";
import CurrentUser from "../common/decorators/current-user";
import { User } from "../user/models/users.model";
import { CartsService } from "./cart.service";
import { CreateCartItemInput } from "./dto/create-cart.input";
import { ShippingInput } from "./dto/shipping.input";
import { CartItem } from "./models/cart.item.model";
import CartItemSchema from "./schemas/cart.item.schema";
import CartSchema from "./schemas/cart.schema";
import { COOKIE_SSID } from "./const";

@Resolver(() => CartSchema)
@Service()
export class CartsResolver {
  constructor(
    @Inject()
    private readonly cartsService: CartsService
  ) {}

  @Mutation(() => String, {
    description: "Create a guest cart return a randomly-generated cart ID",
  })
  async createEmptyCart(@Ctx() { res, req }: any): Promise<string> {
    const cart_id = req.cookies ? req.cookies[COOKIE_SSID] : null;

    if (cart_id) return cart_id;

    const rs = await this.cartsService.createCart();
    if (res.cookies) {
      res.cookies(COOKIE_SSID, rs.cart_id, {
        expires: new Date(Date.now() + 900000),
        httpOnly: true,
      });
    }

    return rs.cart_id;
  }

  @Mutation(() => String, {
    description:
      "Create a customer cart return a randomly-generated cart ID for the customer's authozation",
  })
  @Authorized()
  async customerCart(
    @CurrentUser() currentUser: User,
    @Ctx() { req, res }: any
  ): Promise<string> {
    const cart_id = req.cookies ? req.cookies[COOKIE_SSID] : null;

    if (cart_id) {
      const cart = await this.cartsService.getCartByCartId(cart_id);

      if (cart.created_by) {
        return cart.cart_id;
      }
    }

    const cart = await this.cartsService.createCart(currentUser);
    if (res.cookies) {
      res.cookies(COOKIE_SSID, cart.cart_id, {
        expires: new Date(Date.now() + 900000),
        httpOnly: true,
      });
    }

    return cart.cart_id;
  }

  @Query(() => CartSchema, {
    description:
      "Use the cart query to retrieve information about a particular cart",
  })
  async cart(
    @Ctx() { req }: any,
    @Arg("cart_id", { nullable: true }) cart_id: string
  ): Promise<any> {
    cart_id = cart_id ?? req.cookies[COOKIE_SSID];

    if (cart_id) {
      const rs = await this.cartsService.getCartInforById(cart_id);

      rs.items.forEach((t: CartItem) => {
        t.product.imgUrls = t.product.imgUrls.map((i: string) => {
          return `http://${req.headers.host}/static/${i}`;
        });
      });

      return rs;
    } else {
      return new CartSchema();
    }
  }

  @Mutation(() => [CartItemSchema], {
    description: "Add products into the shopping cart",
  })
  async addProductsToCart(
    @Arg("input") input: CreateCartItemInput,
    @Ctx() { req }: any
  ): Promise<CartItem[]> {
    const cart_id = req.cookies ? req.cookies[COOKIE_SSID] : null;

    if (!cart_id && !input.cart_id) throw new Error("Input valid data!");

    input.cart_id = input.cart_id ? input.cart_id : cart_id;

    return await this.cartsService.addProductsToCart(input);
  }

  @Mutation(() => ShippingInfoSchema, {
    description: "Add shipping infor to the cart",
  })
  async setShippingInfoOnCart( 
    @Arg("input") input: ShippingInput,
    @Ctx() { req }: any
  ): Promise<ShippingInfo> {
    const cart_id = req.cookies ? req.cookies[COOKIE_SSID] : null;

    if (!cart_id) throw new Error("you are fool me!");
    input.cart_id = cart_id;

    return this.cartsService.setShippingInfoOnCart(input);
  }
}
