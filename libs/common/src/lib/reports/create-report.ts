import { IncludeUser } from '../users/include-user';

/**
 * The CreateReport class.
 */
export class CreateReport {
  /**
   * The global unique id of the content to report.
   */
  public guid!: string;

  /**
   * The content of the new report.
   */
  public content!: string;

  /**
   * The user who created the report.
   */
  public user!: IncludeUser;
}
