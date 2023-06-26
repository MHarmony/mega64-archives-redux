import { Comment as CommentInterface } from '@mega64/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Reply } from '../../replies/entities/reply.entity';
import { User } from '../../users/entities/user.entity';

/**
 * The Comment entity.
 *
 * @decorator `@Entity`
 */
@Entity()
export class Comment implements CommentInterface {
  /**
   * The unique id of the comment.
   *
   * @decorator `@ApiProperty`
   * @decorator `@PrimaryGeneratedColumn`
   */
  @ApiProperty({
    description: 'The unique id of the comment.',
    example: '1',
    nullable: false,
  })
  @PrimaryGeneratedColumn('identity')
  public id!: number;

  /**
   * The global unique id of the comment.
   *
   * @decorator `@ApiProperty`
   * @decorator `@Generated`
   * @decorator `@Column`
   * @decorator `@Index`
   */
  @ApiProperty({
    description: 'The global unique id of the comment.',
    example: uuidv4(),
    nullable: false,
  })
  @Generated('uuid')
  @Column({ nullable: false, unique: true })
  @Index()
  public guid!: string;

  /**
   * The content of the comment.
   *
   * @decorator `@ApiProperty`
   * @decorator `@Column`
   * @decorator `@Index`
   */
  @ApiProperty({
    description: 'The content of the comment.',
    example: 'This video rulez!',
    maxLength: 10000,
    nullable: false,
  })
  @Column({ length: 10000, nullable: false })
  @Index()
  public content!: string;

  /**
   * The user who created the comment.
   *
   * @decorator `@ApiProperty`
   * @decorator `@OneToOne`
   * @decorator `@JoinColumn`
   * @decorator `@Index`
   */
  @ApiProperty({
    description: 'The user who created the comment.',
    example: new User('john.doe@gmail.com', 'johndoe'),
    type: User,
  })
  @OneToOne(() => User, { eager: true, nullable: false })
  @JoinColumn()
  @Index()
  public user!: User;

  /**
   * The replies associated with the comment.
   *
   * @decorator `@ApiProperty`
   * @decorator `@OneToMany`
   * @decorator `@Index`
   */
  @ApiProperty({
    description: 'The replies associated with the comment.',
    example: 'This video rulez!',
    nullable: false,
  })
  @OneToMany(() => Reply, (reply) => reply.parentComment, {
    nullable: false,
  })
  public replies!: Reply[];

  /**
   * The date the comment was created.
   *
   * @decorator `@ApiProperty`
   * @decorator `@CreateDateColumn`
   */
  @ApiProperty({
    description: 'The date the comment was created.',
    example: new Date(),
    nullable: false,
  })
  @CreateDateColumn({ nullable: false })
  public createdAt!: Date;

  /**
   * The date the comment was last updated.
   *
   * @decorator `@ApiProperty`
   * @decorator `@UpdateDateColumn`
   */
  @ApiProperty({
    description: 'The date the comment was last updated.',
    example: new Date(),
    nullable: false,
  })
  @UpdateDateColumn({ nullable: false })
  public updatedAt!: Date;

  /**
   * The constructor for the Comment entity.
   *
   * @param content - The content of the comment.
   * @param user - The user who created the comment.
   */
  public constructor(content: string, user: User) {
    this.content = content;
    this.user = user;
  }
}
