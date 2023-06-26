import { IncludeComment } from '../comments/include-comment';
import { IncludeUser } from '../users/include-user';

/**
 * The CreateReply class.
 */
export class CreateReply {
  /**
   * The content of the new reply.
   */
  public content!: string;

  /**
   * The user who created the reply.
   */
  public user!: IncludeUser;

  /**
   * The parent comment.
   */
  public parentComment!: IncludeComment;
}
