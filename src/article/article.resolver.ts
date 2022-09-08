import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { Inject, Service } from "typedi";
import { PaginationArgs } from "../common/pagination/pagination.args";
import { Pagination } from "../common/pagination/pagination.type";
import CurrentUser from "../common/decorators/current-user";
import { User } from "../user/models/users.model";
import { ArticlesService } from "./article.service";
import { PaginatedArticle } from "./dto/article/article.type";
import { CreateArticleInput } from "./dto/article/create-article.input";
import { UpdateArticleInput } from "./dto/article/update-article.input";
import { Article } from "./models/article.model";
import ArticleSchema from "./schemas/article.schema";
import { ArticleIdInput } from "./dto/article/article-id.input";
import { Success } from "../common/dto/success.type";
import { ArticleFilterInput } from "./dto/article/article-filter.input";

@Resolver(() => ArticleSchema)
@Service()
export class ArticlesResolver {
  constructor(
    @Inject("article.service")
    private readonly articlesService: ArticlesService
  ) {}

  //   @ResolveField(() => User)
  //   async author(@Parent() article: Article): Promise<User> {
  //     return this.articleLoader.batchAuthors.load(article.author._id);
  //   }

  //   @ResolveField(() => [Comment])
  //   async comments(@Parent() article: Article): Promise<Comment[]> {
  //     return this.articleLoader.batchComments.load(article._id);
  //   }

  @Query(() => PaginatedArticle, { description: "get all articles" })
  async allArticles(
    @Arg("pageInfo", { nullable: true }) pageInfo: PaginationArgs
  ): Promise<Pagination<Article>> {
    const rs = this.articlesService.findByTagAndPaginated(
      {},
      pageInfo.page,
      pageInfo.pageSize
    );
    return rs;
  }

  @Query(() => ArticleSchema, { description: "get article by filter" })
  async getArticle(
    @Arg("filter") articleGetInput: ArticleFilterInput
  ): Promise<Article | null> {
    return await this.articlesService.findUrlIfExists(articleGetInput);
  }

  @Authorized()
  @Mutation(() => ArticleSchema, { description: "create a new article" })
  async createArticle(
    @Arg("input") createArticleInput: CreateArticleInput,
    @CurrentUser() currentUser: User
  ): Promise<Article> {
    return await this.articlesService.create(createArticleInput, currentUser);
  }

  @Authorized()
  @Mutation(() => ArticleSchema, { description: "update an existing article" })
  async updateArticle(
    @Arg("input") updateArticleInput: UpdateArticleInput,
    @CurrentUser() currentUser: User
  ): Promise<Article> {
    return await this.articlesService.update(updateArticleInput, currentUser);
  }

  @Authorized()
  @Mutation(() => Success, { description: "delete an existing article" })
  async deleteArticle(
    @Arg("input") articleDeleteInput: ArticleIdInput,
    @CurrentUser() user: User
  ): Promise<Success> {
    const res = await this.articlesService.delete(
      articleDeleteInput.articleId,
      user
    );

    return { success: res };
  }

  //   @Subscription(() => Article)
  //   async articleAdded() {
  //     return this.pubSub.asyncIterator(ARTICLE_ADDED_EVENT);
  //   }
}
