import { UserType } from './user-type.enum';

/**
 * The User class.
 */
export class User {
  /**
   * The unique id of the user.
   */
  public id!: number;

  /**
   * The global unique id of the user.
   */
  public guid!: string;

  /**
   * The email of the user.
   */
  public email!: string;

  /**
   * The name of the user.
   */
  public name!: string;

  /**
   * The type of the user.
   */
  public type!: UserType;

  /**
   * The date the user was created.
   */
  public createdAt!: Date;

  /**
   * The date the user was last updated.
   */
  public updatedAt!: Date;

  /**
   * The constructor for the User class.
   *
   * @param email - The email of the user.
   * @param name - The name of the user.
   */
  public constructor(email: string, name: string) {
    this.email = email;
    this.name = name;
  }
}
