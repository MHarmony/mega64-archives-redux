import { Tag as TagInterface } from '@mega64/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../users/entities/user.entity';

/**
 * The Tag entity.
 *
 * @decorator `@Entity`
 * @decorator `@Index`
 */
@Entity()
@Index(['itemGuid', 'content'], { unique: true })
export class Tag implements TagInterface {
  /**
   * The unique id of the tag.
   *
   * @decorator `@ApiProperty`
   * @decorator `@PrimaryGeneratedColumn`
   */
  @ApiProperty({
    description: 'The unique id of the tag.',
    example: '1',
    nullable: false,
  })
  @PrimaryGeneratedColumn('identity')
  public id!: number;

  /**
   * The global unique id of the tag.
   *
   * @decorator `@ApiProperty`
   * @decorator `@Generated`
   * @decorator `@Column`
   * @decorator `@Index`
   */
  @ApiProperty({
    description: 'The global unique id of the tag.',
    example: uuidv4(),
    nullable: false,
  })
  @Generated('uuid')
  @Column({ nullable: false, unique: true })
  @Index()
  public guid!: string;

  /**
   * The global unique id of the tagged item.
   *
   * @decorator `@ApiProperty`
   * @decorator `@Column`
   * @decorator `@Index`
   */
  @ApiProperty({
    description: 'The global unique id of the tag.',
    example: uuidv4(),
    nullable: false,
  })
  @Column({ nullable: false })
  @Index()
  public itemGuid!: string;

  /**
   * The content of the tag.
   *
   * @decorator `@ApiProperty`
   * @decorator `@Column`
   * @decorator `@Index`
   */
  @ApiProperty({
    description: 'The content of the tag.',
    example: 'new shawn',
    maxLength: 30,
    nullable: false,
  })
  @Column({ length: 30, nullable: false })
  @Index()
  public content!: string;

  /**
   * The user who created the tag.
   *
   * @decorator `@ApiProperty`
   * @decorator `@OneToOne`
   * @decorator `@JoinColumn`
   * @decorator `@Index`
   */
  @ApiProperty({
    description: 'The user who created the tag.',
    example: new User('john.doe@gmail.com', 'johndoe'),
    type: User,
  })
  @OneToOne(() => User, { eager: true, nullable: false })
  @JoinColumn()
  @Index()
  public user!: User;

  /**
   * The date the tag was created.
   *
   * @decorator `@ApiProperty`
   * @decorator `@CreateDateColumn`
   */
  @ApiProperty({
    description: 'The date the tag was created.',
    example: new Date(),
    nullable: false,
  })
  @CreateDateColumn({ nullable: false })
  public createdAt!: Date;

  /**
   * The date the tag was last updated.
   *
   * @decorator `@ApiProperty`
   * @decorator `@UpdateDateColumn`
   */
  @ApiProperty({
    description: 'The date the tag was last updated.',
    example: new Date(),
    nullable: false,
  })
  @UpdateDateColumn({ nullable: false })
  public updatedAt!: Date;

  /**
   * The constructor for the Tag entity.
   *
   * @param content - The content of the tag.
   * @param itemGuid - The global unique id of the tagged item.
   * @param user - The user who create the tag.
   */
  public constructor(content: string, itemGuid: string, user: User) {
    this.content = content;
    this.itemGuid = itemGuid;
    this.user = user;
  }

  /**
   * Transform the content property to lower case.
   *
   * @decorator `@BeforeInsert`
   */
  // istanbul ignore next
  @BeforeInsert()
  // istanbul ignore next
  public contentToLowerCase(): void {
    // istanbul ignore next
    this.content = this.content.toLowerCase();
  }
}
