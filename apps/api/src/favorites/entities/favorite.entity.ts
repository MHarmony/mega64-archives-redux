import { Favorite as FavoriteInterface } from '@mega64/common';
import { ApiProperty } from '@nestjs/swagger';
import {
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
import { Media } from '../../medias/entities/media.entity';
import { User } from '../../users/entities/user.entity';

/**
 * The Favorite entity.
 *
 * @decorator `@Entity`
 */
@Entity()
export class Favorite implements FavoriteInterface {
  /**
   * The unique id of the favorite.
   *
   * @decorator `@ApiProperty`
   * @decorator `@PrimaryGeneratedColumn`
   */
  @ApiProperty({
    description: 'The unique id of the favorite.',
    example: '1',
    nullable: false,
  })
  @PrimaryGeneratedColumn('identity')
  public id!: number;

  /**
   * The global unique id of the favorite.
   *
   * @decorator `@ApiProperty`
   * @decorator `@Generated`
   * @decorator `@Column`
   * @decorator `@Index`
   */
  @ApiProperty({
    description: 'The global unique id of the favorite.',
    example: uuidv4(),
    nullable: false,
  })
  @Generated('uuid')
  @Column({ nullable: false, unique: true })
  @Index()
  public guid!: string;

  /**
   * The favorited media
   *
   * @decorator `@ApiProperty`
   * @decorator `@OneToOne`
   * @decorator `@JoinColumn`
   * @decorator `@Index`
   */
  @ApiProperty({
    description: 'The favorited media.',
    nullable: false,
    type: Media,
  })
  @OneToOne(() => Media, { eager: true, nullable: false })
  @JoinColumn()
  @Index()
  public media!: Media;

  /**
   * The user who created the favorite.
   *
   * @decorator `@ApiProperty`
   * @decorator `@OneToOne`
   * @decorator `@JoinColumn`
   * @decorator `@Index`
   */
  @ApiProperty({
    description: 'The user who created the favorite.',
    example: new User('john.doe@gmail.com', 'johndoe'),
    type: User,
  })
  @OneToOne(() => User, { eager: true, nullable: false })
  @JoinColumn()
  @Index()
  public user!: User;

  /**
   * The date the favorite was created.
   *
   * @decorator `@ApiProperty`
   * @decorator `@CreateDateColumn`
   */
  @ApiProperty({
    description: 'The date the favorite was created.',
    example: new Date(),
    nullable: false,
  })
  @CreateDateColumn({ nullable: false })
  public createdAt!: Date;

  /**
   * The date the favorite was last updated.
   *
   * @decorator `@ApiProperty`
   * @decorator `@UpdateDateColumn`
   */
  @ApiProperty({
    description: 'The date the favorite was last updated.',
    example: new Date(),
    nullable: false,
  })
  @UpdateDateColumn({ nullable: false })
  public updatedAt!: Date;

  /**
   * The constructor for the Tag entity.
   *
   * @param media - The favorited media.
   * @param user - The user who created the favorite.
   */
  public constructor(media: Media, user: User) {
    this.media = media;
    this.user = user;
  }
}
