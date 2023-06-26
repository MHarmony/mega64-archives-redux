import { Comment } from '../comments/comment';
import { User } from '../users/user';

/**
 * The Reply class.
 */
export class Reply {
  /**
   * The unique id of the reply.
   */
  public id!: number;

  /**
   * The global unique id of the reply.
   */
  public guid!: string;

  /**
   * The content of the reply.
   */
  public content!: string;

  /**
   * The user who created the reply.
   */
  public user!: User;

  /**
   * The parent comment.
   */
  public parentComment!: Comment;

  /**
   * The date the reply was created.
   */
  public createdAt!: Date;

  /**
   * The date the reply was last updated.
   */
  public updatedAt!: Date;

  /**
   * The constructor for the Reply class.
   *
   * @param content - The content of the reply.
   * @param parentComment - The parentComment for the reply.
   * @param user - The user who created the reply.
   */
  public constructor(content: string, parentComment: Comment, user: User) {
    this.content = content;
    this.parentComment = parentComment;
    this.user = user;
  }
}
