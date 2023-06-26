import { MediaType } from './media-type.enum';

/**
 * The CreateMedia class.
 */
export class CreateMedia {
  /**
   * The title of the media.
   */
  public title!: string;

  /**
   * The description of the media.
   */
  public description?: string;

  /**
   * The link to the media.
   */
  public link!: string;

  /**
   * The type of the media.
   */
  public type!: MediaType;

  /**
   * The date the actual content was released.
   */
  public releaseDate!: Date;
}
