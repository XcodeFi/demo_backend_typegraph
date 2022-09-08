import { Arg, Args, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Inject, Service } from "typedi";
import CurrentUser from "../common/decorators/current-user";
import { User } from "../user/models/users.model";
import { ProductsService } from "./product.service";
import { CreateProductInput } from "./dto/product/create-product.input";
import { UpdateProductInput } from "./dto/product/update-product.input";
import { Product } from "./models/product.model";
import { ProductSchema } from "./schemas/product.schema";
import { ProductIdInput } from "./dto/product/product-id.input";
import { Success } from "../common/dto/success.type";
import { ProductFilterInput } from "./dto/product/product-filter.input";
import { PaginatedProduct } from "./dto/product/product.type";
import { PaginationArgs } from "../common/pagination/pagination.args";
import { Pagination } from "../common/pagination/pagination.type";
// import { EventEmitter } from "stream";

@Resolver(() => ProductSchema)
@Service()
export class ProductsResolver {
  constructor(
    @Inject()
    private readonly productsService: ProductsService
  ) { }

  //   @ResolveField(() => User)
  //   async author(@Parent() product: Product): Promise<User> {
  //     return this.productLoader.batchAuthors.load(product.author._id);
  //   }

  //   @ResolveField(() => [Comment])
  //   async comments(@Parent() product: Product): Promise<Comment[]> {
  //     return this.productLoader.batchComments.load(product._id);
  //   }

  @Query(() => PaginatedProduct, { description: "get all products" })
  async allProducts(
    @Arg("pageInfo", { nullable: true }) pageInfo: PaginationArgs,
    @Ctx() { req }: any
  ): Promise<Pagination<Product>> {
    const rs = await this.productsService.findByTagAndPaginated(
      {},
      pageInfo.page,
      pageInfo.pageSize
    );

    rs.results.forEach((t: Product) => {
      t.imgUrls = t.imgUrls.map((i) => {
        return `http://${req.headers.host}/static/${i}`;
      });
    });

    return rs;
  }

  @Query(() => ProductSchema, { description: "get product by urlSlug or id" })
  async getProduct(
    @Args() productGetInput: ProductFilterInput,
    @Ctx() { req }: any
  ): Promise<Product | null> {
    const rs = await this.productsService.findUrlIfExists(productGetInput);

    if (rs) {
      rs!.imgUrls = rs?.imgUrls.map(t =>
        `http://${req.headers.host}/static/${t}`
      );
    }

    return rs;
  }

  @Authorized()
  @Mutation(() => ProductSchema, { description: "create a new product" })
  async createProduct(
    @Arg("input") createProductInput: CreateProductInput,
    @CurrentUser() currentUser: User
  ): Promise<Product> {
    return await this.productsService.create(createProductInput, currentUser);
  }

  @Authorized()
  @Mutation(() => ProductSchema, { description: "update an existing product" })
  async updateProduct(
    @Arg("input") updateProductInput: UpdateProductInput,
    @CurrentUser() currentUser: User
  ): Promise<Product> {
    return await this.productsService.update(updateProductInput, currentUser);
  }

  @Authorized()
  @Mutation(() => Success, { description: "delete an existing product" })
  async deleteProduct(
    @Arg("input") productDeleteInput: ProductIdInput,
    @CurrentUser() user: User
  ): Promise<Success> {
    const res = await this.productsService.delete(
      productDeleteInput.productId,
      user
    );

    return { success: res };
  }

  //   @Subscription(() => Product)
  //   async productAdded() {
  //     return this.pubSub.asyncIterator(ARTICLE_ADDED_EVENT);
  //   }
}
