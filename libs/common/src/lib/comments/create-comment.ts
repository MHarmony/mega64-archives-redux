import { IncludeUser } from '../users/include-user';

/**
 * The CreateComment class.
 */
export class CreateComment {
  /**
   * The content of the new comment.
   */
  public content!: string;

  /**
   * The user who created the comment.
   */
  public user!: IncludeUser;
}
