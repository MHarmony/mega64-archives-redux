import { User } from '../users/user';

/**
 * The Report class.
 */
export class Report {
  /**
   * The unique id of the report.
   */
  public id!: number;

  /**
   * The global unique id of the content reported.
   */
  public guid!: string;

  /**
   * The content of the new report.
   */
  public content!: string;

  /**
   * The resolution flag of the report.
   */
  public resolved!: boolean;

  /**
   * The user who created the report.
   */
  public user!: User;

  /**
   * The date the report was created.
   */
  public createdAt!: Date;

  /**
   * The date the report was last updated.
   */
  public updatedAt!: Date;

  /**
   * The constructor for the Report class.
   *
   * @param content - The content of the report.
   * @param guid - The global unique id of the item reported.
   */
  public constructor(content: string, guid: string) {
    this.content = content;
    this.guid = guid;
  }
}
