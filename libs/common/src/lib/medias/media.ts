import { MediaType } from './media-type.enum';

/**
 * The Media class.
 */
export class Media {
  /**
   * The unique id of the media.
   */
  public id!: number;

  /**
   * The global unique id of the media.
   */
  public guid!: string;

  /**
   * The title of the media.
   */
  public title!: string;

  /**
   * The description of the media.
   */
  public description?: string;

  /**
   * The The link to the media.
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

  /**
   * The date the media was created.
   */
  public createdAt!: Date;

  /**
   * The date the media was last updated.
   */
  public updatedAt!: Date;
}
