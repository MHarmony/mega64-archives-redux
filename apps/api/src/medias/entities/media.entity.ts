import { Media as MediaInterface, MediaType } from '@mega64/common';
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
 * The Media entity.
 *
 * @decorator `@Entity`
 */
@Entity()
export class Media implements MediaInterface {
  /**
   * The unique id of the media.
   *
   * @decorator `@ApiProperty`
   * @decorator `@PrimaryGeneratedColumn`
   */
  @ApiProperty({
    description: 'The unique id of the media.',
    example: '1',
    nullable: false,
  })
  @PrimaryGeneratedColumn('identity')
  public id!: number;

  /**
   * The global unique id of the media.
   *
   * @decorator `@ApiProperty`
   * @decorator `@Generated`
   * @decorator `@Column`
   * @decorator `@Index`
   */
  @ApiProperty({
    description: 'The global unique id of the media.',
    example: uuidv4(),
    nullable: false,
  })
  @Generated('uuid')
  @Column({ nullable: false, unique: true })
  @Index()
  public guid!: string;

  /**
   * The title of the media.
   *
   * @decorator `@ApiProperty`
   * @decorator `@Column`
   * @decorator `@Index`
   */
  @ApiProperty({
    description: 'The title of the media.',
    example: 'Podcast 120',
    maxLength: 50,
    nullable: false,
  })
  @Column({ length: 50, nullable: false })
  @Index()
  public title!: string;

  /**
   * The description of the media.
   *
   * @decorator `@ApiProperty`
   * @decorator `@Column`
   * @decorator `@Index`
   */
  @ApiProperty({
    description: 'The description of the media.',
    example: 'This is podcast 120',
    maxLength: 255,
    nullable: true,
  })
  @Column({ length: 255, nullable: true })
  public description?: string;

  /**
   * The The link to the media.
   *
   * @decorator `@ApiProperty`
   * @decorator `@Column`
   */
  @ApiProperty({
    description: 'The link to the media.',
    example: 'https://link.to.media',
    maxLength: 500,
    nullable: false,
  })
  @Column({ length: 500, nullable: false })
  public link!: string;

  /**
   * The type of the media.
   *
   * @decorator `@ApiProperty`
   * @decorator `@Column`
   * @decorator `@Index`
   */
  @ApiProperty({
    description: 'The type of the media.',
    enum: MediaType,
    example: MediaType.PODCAST_VIDEO,
    nullable: false,
  })
  @Column({ enum: MediaType, nullable: false, type: 'enum' })
  @Index()
  public type!: MediaType;

  /**
   * The date the actual content was released.
   *
   * @decorator `@ApiProperty`
   * @decorator `@Column`
   * @decorator `@Index`
   */
  @ApiProperty({
    description: 'The date the actual content was released.',
    example: new Date(),
    nullable: false,
  })
  @Column({ nullable: false })
  @Index()
  public releaseDate!: Date;

  /**
   * The date the media was created.
   *
   * @decorator `@ApiProperty`
   * @decorator `@CreateDateColumn`
   */
  @ApiProperty({
    description: 'The date the media was created.',
    example: new Date(),
    nullable: false,
  })
  @CreateDateColumn({ nullable: false })
  public createdAt!: Date;

  /**
   * The date the media was last updated.
   *
   * @decorator `@ApiProperty`
   * @decorator `@UpdateDateColumn`
   */
  @ApiProperty({
    description: 'The date the media was last updated.',
    example: new Date(),
    nullable: false,
  })
  @UpdateDateColumn({ nullable: false })
  public updatedAt!: Date;
}
