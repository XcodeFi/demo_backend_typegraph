
// @Injectable()
// export class CommentService  {
//   constructor(
//     @InjectModel(Comment.name)
//     private readonly commentModel: Model<CommentDocument>,
//     private readonly articlesService: ArticlesService,
//     @InjectModel(Article.name)
//     private readonly articleModel: Model<ArticleDocument>,
//     @Inject(PUB_SUB) private readonly pubSub: PubSub,
//   ) {
//     super(commentModel);
//   }

//   async addComment(
//     articleId: ObjectId,
//     body: string,
//     user: User,
//   ): Promise<Comment> {
//     const article = await this.articlesService.findOne({ _id: articleId });
//     const comment = new this.commentModel({
//       author: user,
//       body,
//     });
//     const newComment = await comment.save();
//     article.comments.push(newComment);
//     await (article as ArticleDocument).save();
//     await this.pubSub.publish(COMMENT_ADDED_EVENT, {
//       commentAdded: newComment,
//     });
//     return newComment;
//   }

//   async deleteComment(
//     commentId: ObjectId,
//     user: User,
//     articleId: ObjectId,
//   ): Promise<boolean> {
//     await this.commentModel.deleteOne({ _id: commentId });
//     await this.articleModel.updateOne(
//       {
//         _id: articleId,
//       },
//       {
//         $pull: {
//           comments: { author: user, _id: commentId },
//         },
//       },
//     );
//     return true;
//   }
// }
