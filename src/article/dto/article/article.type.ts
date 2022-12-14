import { Paginated } from "../../../common/pagination/pagination.type";
import { ObjectType } from "type-graphql";
import ArticleSchema from "../../schemas/article.schema";

@ObjectType()
export class PaginatedArticle extends Paginated(ArticleSchema) {}
