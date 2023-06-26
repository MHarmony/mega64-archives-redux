import { IncludeUser } from '../users/include-user';

/**
 * The CreateTag class.
 */
export class CreateTag {
  /**
   * The content of the new tag.
   */
  public content!: string;

  /**
   * The global unique id of the tagged item.
   */
  public itemGuid!: string;

  /**
   * The user who created the tag.
   */
  public user!: IncludeUser;
}
