import { FilterQuery } from 'mongoose';
import { GraphQLError } from "graphql";
import { Inject, Service } from "typedi";
import { Pagination } from "../common/pagination/pagination.type";
import { User } from "../user/models/users.model";
import { ProductFilterInput } from "./dto/product/product-filter.input";
import { CreateProductInput } from "./dto/product/create-product.input";
import { UpdateProductInput } from "./dto/product/update-product.input";
import { Product, ProductModel } from "./models/product.model";
import { ProductStatusType } from "./enum/productStatusType";
import { FileUploadService } from "../file/file.service";
import { toSlug } from "../utils";

@Service()
export class ProductsService {
  AUTHOR_DETAIL = "id email username profilePicUrl";

  DEFAULT_PAGE_INDEX = 0;
  DEFAULT_PAGE_LIMIT = 10;

  constructor(
    @Inject()
    private readonly fileUploadService: FileUploadService
  ) { }

  async findByTagAndPaginated(
    findQuery: Partial<Product>,
    pageNumber: number = this.DEFAULT_PAGE_INDEX,
    limit: number = this.DEFAULT_PAGE_LIMIT
  ): Promise<Pagination<Product>> {
    const query = {
      ...findQuery
    } as FilterQuery<Product>;

    const count = await ProductModel.count(query);

    const rs = await ProductModel.find(query)
      .skip(limit * (pageNumber - 1))
      .limit(limit)
      .populate("createdBy", this.AUTHOR_DETAIL)
      .sort({ updatedAt: -1 })
      .lean<Product[]>()
      .exec();

    const pagination: Pagination<Product> = {
      results: rs,
      totalCount: count,
      hasPreviousPage: false,
      hasNextPage: false,
      page: pageNumber,
      totalPages: count,
      nextPage: 1,
      prevPage: 1,
    };

    return pagination;
  }

  async create(prod: CreateProductInput, user: User): Promise<Product> {
    const urlSlug = toSlug(prod.name);
    const product = {
      ...prod,
      urlSlug: urlSlug,
      status: ProductStatusType.draft,
      createdAt: new Date(),
    } as Product;

    if (prod.files) {
      product.imgUrls = await this.fileUploadService.saveMutilFile(prod.files);
    }

    product.createdBy = user._id;

    const createdProduct = await ProductModel.create(product);

    createdProduct.imgUrls = createdProduct.imgUrls.map(t => this.fileUploadService.getFilePath(t));

    return createdProduct;
  }

  async update(prod: UpdateProductInput, updatedBy: User): Promise<Product> {
    const product = {
      ...prod,
    } as Product;

    product.updatedAt = new Date();
    product.updatedBy = updatedBy._id;

    const updatedDoc = await ProductModel.findByIdAndUpdate(
      product._id,
      product,
      {
        returnDocument: "after",
      }
    )
      .lean<Product>()
      .exec();

    return { ...updatedDoc };
  }

  async delete(id: string, deletedBy: User): Promise<boolean> {
    const blog = await this.findProductAllDataById(id);

    if (!blog) throw new Error("Product does not exists");

    if (!(blog.createdBy as any)._id.equals(deletedBy._id))
      throw new GraphQLError("You don't have necessary permissions");

    blog.status = ProductStatusType.delete;
    blog.updatedBy = deletedBy._id;
    blog.updatedAt = new Date();

    const rs = await ProductModel.updateOne(
      { _id: id },
      { $set: { ...blog } }
    ).exec();

    return rs.modifiedCount > 0;
  }

  async findProductAllDataById(id: string): Promise<Product | null> {
    return await ProductModel.findOne({
      _id: id
    })
      .populate("createdBy", this.AUTHOR_DETAIL)
      .lean<Product>()
      .exec();
  }

  async findUrlIfExists(
    queryInput: ProductFilterInput
  ): Promise<Product | null> {
    if (!queryInput.id && !queryInput.urlSlug)
      return null;

    var rs = await ProductModel.findOne({
      $or: [{ _id: queryInput.id }, { urlSlug: queryInput.urlSlug }],
    })
      .lean<Product>()
      .exec();

    return rs;
  }
}
