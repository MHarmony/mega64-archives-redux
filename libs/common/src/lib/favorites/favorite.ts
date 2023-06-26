import { Media } from '../medias/media';
import { User } from '../users/user';

/**
 * The Favorite class.
 */
export class Favorite {
  /**
   * The unique id of the favorite.
   */
  public id!: number;

  /**
   * The global unique id of the favorite.
   */
  public guid!: string;

  /**
   * The favorited media
   */
  public media!: Media;

  /**
   * The user who created the favorite.
   */
  public user!: User;

  /**
   * The date the favorite was created.
   */
  public createdAt!: Date;

  /**
   * The date the favorite was last updated.
   */
  public updatedAt!: Date;

  /**
   * The constructor for the Tag class.
   *
   * @param media - The favorited media.
   * @param user - The user who created the favorite.
   */
  public constructor(media: Media, user: User) {
    this.media = media;
    this.user = user;
  }
}
