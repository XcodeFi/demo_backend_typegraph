import { GraphQLError } from "graphql";
import { FilterQuery, Types } from "mongoose";
import { Service } from "typedi";
import { Pagination } from "../common/pagination/pagination.type";
import { User } from "../user/models/users.model";
import { ArticleFilterInput } from "./dto/article/article-filter.input";
import { CreateArticleInput } from "./dto/article/create-article.input";
import { UpdateArticleInput } from "./dto/article/update-article.input";
import { Article, ArticleModel } from "./models/article.model";

@Service("article.service")
export class ArticlesService {
  AUTHOR_DETAIL = "id email username profilePicUrl";

  // BLOG_ALL_DATA = '+id +text +draftText +isSubmitted +isDraft +isPublished +status +createdBy +updatedBy +createdAt';

  DEFAULT_PAGE_INDEX = 0;
  DEFAULT_PAGE_LIMIT = 10;

  constructor() {}

  async findByTagAndPaginated(
    findQuery: Partial<Article>,
    pageNumber: number = this.DEFAULT_PAGE_INDEX,
    limit: number = this.DEFAULT_PAGE_LIMIT
  ): Promise<Pagination<Article>> {
    const query = {
      ...findQuery,
      status: true,
      isPublished: false,
    } as FilterQuery<Article>;

    const count = await ArticleModel.count(query);

    const rs = await ArticleModel.find(query)
      .skip(limit * (pageNumber - 1))
      .limit(limit)
      // .select(this.BLOG_ALL_DATA)
      .populate("createdBy", this.AUTHOR_DETAIL)
      .sort({ updatedAt: -1 })
      .lean<Article[]>()
      .exec();

    const pagination: Pagination<Article> = {
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

  async create(blog: CreateArticleInput, user: User): Promise<Article> {
    const findRs = await this.findUrlIfExists({slug: blog.blogUrl} as ArticleFilterInput);

    if (findRs) throw new Error("Blog with this url already exists");

    const now = new Date();

    const article = {
      ...blog,
      tags: blog.tags,
      score: 0,
      draftText: blog.text,
      text: "",
      isPublished: false,
      imgUrl: "url",
      createdAt: now,
    } as Article;

    article.createdBy = user._id;

    const createdBlog = await ArticleModel.create(article);

    return createdBlog;
  }

  async update(blog: UpdateArticleInput, updatedBy: User): Promise<Article> {
    const article = {
      ...blog,
      description: "",
      tags: ["asdf"],
      score: 0,
      isSubmitted: false,
      isDraft: false,
      isPublished: false,
    } as unknown as Article;

    article.updatedAt = new Date();
    article.updatedBy = updatedBy._id;

    const updatedDoc = await ArticleModel.findByIdAndUpdate(
      article._id,
      article,
      {
        returnDocument: "after",
      }
    )
      .select("+text")
      .lean<Article>()
      .exec();

    return { ...updatedDoc };
  }

  async delete(id: string, deletedBy: User): Promise<boolean> {
    const blog = await this.findBlogAllDataById(id);
    if (!blog) throw new Error("Blog does not exists");
    if (!(blog.createdBy as any)._id.equals(deletedBy._id))
      throw new GraphQLError("You don't have necessary permissions");

    if (blog.isPublished) {
      blog.isDraft = false;
      // revert to the original state
      blog.draftText = blog.text;
    } else {
      blog.status = false;
    }

    blog.updatedBy = deletedBy._id;
    blog.updatedAt = new Date();

    const rs = await ArticleModel.updateOne(
      { _id: id },
      { $set: { ...blog } }
    ).exec();

    return rs.modifiedCount > 0;
  }

  async findBlogAllDataById(id: string): Promise<Article | null> {
    return await ArticleModel.findOne({
      _id: new Types.ObjectId(id),
      status: true,
    })
      // .select(this.BLOG_ALL_DATA)
      .populate("createdBy", this.AUTHOR_DETAIL)
      .lean<Article>()
      .exec();
  }

  async findUrlIfExists(
    queryInput: ArticleFilterInput
  ): Promise<Article | null> {
    var rs = await ArticleModel.findOne({
      $or: [{ _id: queryInput.id }, { blogUrl: queryInput.slug }],
    })
      .lean<Article>()
      .exec();

      return rs;
  }
}
