import { IncludeMedia } from '../medias/include-media';
import { IncludeUser } from '../users/include-user';

/**
 * The CreateFavorite class.
 */
export class CreateFavorite {
  /**
   * The favorited media
   */
  public media!: IncludeMedia;

  /**
   * The user who created the favorite.
   */
  public user!: IncludeUser;
}
