import { Paginated } from "../../../common/pagination/pagination.type";
import { ObjectType } from "type-graphql";
import { ProductSchema } from "../../schemas/product.schema";

@ObjectType()
export class PaginatedProduct extends Paginated(ProductSchema) { }
