import { User } from '../users/user';

/**
 * The Tag class.
 */
export class Tag {
  /**
   * The unique id of the tag.
   */
  public id!: number;

  /**
   * The global unique id of the tag.
   */
  public guid!: string;

  /**
   * The global unique id of the tagged item.
   */
  public itemGuid!: string;

  /**
   * The content of the tag.
   */
  public content!: string;

  /**
   * The user who created the tag.
   */
  public user!: User;

  /**
   * The date the user was created.
   */
  public createdAt!: Date;

  /**
   * The date the user was last updated.
   */
  public updatedAt!: Date;

  /**
   * The constructor for the Tag class.
   *
   * @param content - The content of the tag.
   * @param itemGuid - The global unique id of the tagged item.
   * @param user - The user who create the tag.
   */
  public constructor(content: string, itemGuid: string, user: User) {
    this.content = content;
    this.itemGuid = itemGuid;
    this.user = user;
  }
}
