import { User as UserInterface, UserType } from '@mega64/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

/**
 * The User entity.
 *
 * @decorator `@Entity`
 */
@Entity()
export class User implements UserInterface {
  /**
   * The unique id of the user.
   *
   * @decorator `@ApiProperty`
   * @decorator `@PrimaryGeneratedColumn`
   */
  @ApiProperty({
    description: 'The unique id of the user.',
    example: '1',
    nullable: false,
  })
  @PrimaryGeneratedColumn('identity')
  public id!: number;

  /**
   * The global unique id of the user.
   *
   * @decorator `@ApiProperty`
   * @decorator `@Generated`
   * @decorator `@Column`
   * @decorator `@Index`
   */
  @ApiProperty({
    description: 'The global unique id of the user.',
    example: uuidv4(),
    nullable: false,
  })
  @Generated('uuid')
  @Column({ nullable: false, unique: true })
  @Index()
  public guid!: string;

  /**
   * The email of the user.
   *
   * @decorator `@ApiProperty`
   * @decorator `@Column`
   * @decorator `@Index`
   */
  @ApiProperty({
    description: 'The email of the user.',
    example: 'john.doe@gmail.com',
    maxLength: 254,
    nullable: false,
  })
  @Column({ length: 255, nullable: false, unique: true })
  @Index()
  public email!: string;

  /**
   * The name of the user.
   *
   * @decorator `@ApiProperty`
   * @decorator `@Column`
   * @decorator `@Index`
   */
  @ApiProperty({
    description: 'The name of the user.',
    example: 'johndoe',
    maxLength: 30,
    nullable: false,
  })
  @Column({ length: 30, nullable: false, unique: true })
  @Index()
  public name!: string;

  /**
   * The type of the user.
   *
   * @decorator `@ApiProperty`
   * @decorator `@Column`
   * @decorator `@Index`
   */
  @ApiProperty({
    description: 'The type of the user.',
    enum: UserType,
    example: UserType.USER,
    nullable: false,
  })
  @Column({
    default: UserType.USER,
    enum: UserType,
    nullable: false,
    type: 'enum',
  })
  @Index()
  public type!: UserType;

  /**
   * The date the user was created.
   *
   * @decorator `@ApiProperty`
   * @decorator `@CreateDateColumn`
   */
  @ApiProperty({
    description: 'The date the user was created.',
    example: new Date(),
    nullable: false,
  })
  @CreateDateColumn({ nullable: false })
  public createdAt!: Date;

  /**
   * The date the user was last updated.
   *
   * @decorator `@ApiProperty`
   * @decorator `@UpdateDateColumn`
   */
  @ApiProperty({
    description: 'The date the user was last updated.',
    example: new Date(),
    nullable: false,
  })
  @UpdateDateColumn({ nullable: false })
  public updatedAt!: Date;

  /**
   * The constructor for the User entity.
   *
   * @param email - The email of the user.
   * @param name - The name of the user.
   */
  public constructor(email: string, name: string) {
    this.email = email;
    this.name = name;
  }
}
