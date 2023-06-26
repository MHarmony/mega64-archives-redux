import { Reply } from '../replies/reply';
import { User } from '../users/user';

/**
 * The Comment class.
 */
export class Comment {
  /**
   * The unique id of the comment.
   */
  public id!: number;

  /**
   * The global unique id of the comment.
   */
  public guid!: string;

  /**
   * The content of the comment.
   */
  public content!: string;

  /**
   * The user who created the comment.
   */
  public user!: User;

  /**
   * The replies associated with the comment.
   */
  public replies!: Reply[];

  /**
   * The date the comment was created.
   */
  public createdAt!: Date;

  /**
   * The date the comment was last updated.
   */
  public updatedAt!: Date;

  /**
   * The constructor for the Comment class.
   *
   * @param content - The content of the comment.
   * @param user - The user who created the comment.
   */
  public constructor(content: string, user: User) {
    this.content = content;
    this.user = user;
  }
}
