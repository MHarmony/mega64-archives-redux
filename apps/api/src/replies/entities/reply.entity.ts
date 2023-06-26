import { Reply as ReplyInterface } from '@mega64/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Comment } from '../../comments/entities/comment.entity';
import { User } from '../../users/entities/user.entity';

/**
 * The Reply entity.
 *
 * @decorator `@Entity`
 */
@Entity()
export class Reply implements ReplyInterface {
  /**
   * The unique id of the reply.
   *
   * @decorator `@ApiProperty`
   * @decorator `@PrimaryGeneratedColumn`
   */
  @ApiProperty({
    description: 'The unique id of the reply.',
    example: '1',
    nullable: false,
  })
  @PrimaryGeneratedColumn('identity')
  public id!: number;

  /**
   * The global unique id of the reply.
   *
   * @decorator `@ApiProperty`
   * @decorator `@Generated`
   * @decorator `@Column`
   * @decorator `@Index`
   */
  @ApiProperty({
    description: 'The global unique id of the reply.',
    example: uuidv4(),
    nullable: false,
  })
  @Generated('uuid')
  @Column({ nullable: false, unique: true })
  @Index()
  public guid!: string;

  /**
   * The content of the reply.
   *
   * @decorator `@ApiProperty`
   * @decorator `@Column`
   * @decorator `@Index`
   */
  @ApiProperty({
    description: 'The content of the reply.',
    example: 'This video rulez!',
    maxLength: 10000,
    nullable: false,
  })
  @Column({ length: 10000, nullable: false })
  @Index()
  public content!: string;

  /**
   * The user who created the reply.
   *
   * @decorator `@ApiProperty`
   * @decorator `@OneToOne`
   * @decorator `@JoinColumn`
   * @decorator `@Index`
   */
  @ApiProperty({
    description: 'The user who created the reply.',
    example: new User('john.doe@gmail.com', 'johndoe'),
    type: User,
  })
  @OneToOne(() => User, { eager: true, nullable: false })
  @JoinColumn()
  @Index()
  public user!: User;

  /**
   * The parent comment.
   *
   * @decorator `@ApiProperty`
   * @decorator `@OneToOne`
   * @decorator `@JoinColumn`
   * @decorator `@Index`
   */
  @ApiProperty({
    description: 'The parent comment.',
    example: new User('john.doe@gmail.com', 'johndoe'),
    type: Comment,
  })
  @ManyToOne(() => Comment, (comment) => comment.replies, { nullable: false })
  @Index()
  public parentComment!: Comment;

  /**
   * The date the reply was created.
   *
   * @decorator `@ApiProperty`
   * @decorator `@CreateDateColumn`
   */
  @ApiProperty({
    description: 'The date the reply was created.',
    example: new Date(),
    nullable: false,
  })
  @CreateDateColumn({ nullable: false })
  public createdAt!: Date;

  /**
   * The date the reply was last updated.
   *
   * @decorator `@ApiProperty`
   * @decorator `@UpdateDateColumn`
   */
  @ApiProperty({
    description: 'The date the reply was last updated.',
    example: new Date(),
    nullable: false,
  })
  @UpdateDateColumn({ nullable: false })
  public updatedAt!: Date;

  /**
   * The constructor for the Reply entity.
   *
   * @param content - The content of the reply.
   * @param parentComment - The parentComment for the reply.
   * @param user - The user who created the reply.
   */
  public constructor(content: string, parentComment: Comment, user: User) {
    this.content = content;
    this.parentComment = parentComment;
    this.user = user;
  }
}
