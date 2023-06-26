import { Report as ReportInterface } from '@mega64/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../users/entities/user.entity';

/**
 * The Report entity.
 *
 * @decorator `@Entity`
 */
@Entity()
export class Report implements ReportInterface {
  /**
   * The unique id of the report.
   *
   * @decorator `@ApiProperty`
   * @decorator `@PrimaryGeneratedColumn`
   */
  @ApiProperty({
    description: 'The unique id of the report.',
    example: '1',
    nullable: false,
  })
  @PrimaryGeneratedColumn('identity')
  public id!: number;

  /**
   * The global unique id of the content reported.
   *
   * @decorator `@ApiProperty`
   * @decorator `@Column`
   * @decorator `@Index`
   */
  @ApiProperty({
    description: 'The global unique id of the content reported.',
    example: uuidv4(),
    nullable: false,
  })
  @Column({ nullable: false })
  @Index()
  public guid!: string;

  /**
   * The content of the new report.
   *
   * @decorator `@ApiProperty`
   * @decorator `@IsString`
   * @decorator `@IsNotEmpty`
   * @decorator `@MaxLength`
   */
  @ApiProperty({
    description: 'The content of the report.',
    example: 'This video is mean!',
    maxLength: 10000,
    nullable: false,
  })
  @Column({ length: 10000, nullable: false })
  @Index()
  public content!: string;

  /**
   * The resolution flag of the report.
   *
   * @decorator `@ApiProperty`
   * @decorator `@Column`
   * @decorator `@Index`
   */
  @ApiProperty({
    description: 'The resolution flag of the report.',
    example: false,
    nullable: false,
  })
  @Column({ default: false, nullable: false })
  @Index()
  public resolved!: boolean;

  /**
   * The user who created the report.
   *
   * @decorator `@ApiProperty`
   * @decorator `@OneToOne`
   * @decorator `@JoinColumn`
   * @decorator `@Index`
   */
  @ApiProperty({
    description: 'The user who created the report.',
    example: new User('john.doe@gmail.com', 'johndoe'),
    type: User,
  })
  @OneToOne(() => User, { eager: true, nullable: false })
  @JoinColumn()
  @Index()
  public user!: User;

  /**
   * The date the report was created.
   *
   * @decorator `@ApiProperty`
   * @decorator `@CreateDateColumn`
   */
  @ApiProperty({
    description: 'The date the report was created.',
    example: new Date(),
    nullable: false,
  })
  @CreateDateColumn({ nullable: false })
  public createdAt!: Date;

  /**
   * The date the report was last updated.
   *
   * @decorator `@ApiProperty`
   * @decorator `@UpdateDateColumn`
   */
  @ApiProperty({
    description: 'The date the report was last updated.',
    example: new Date(),
    nullable: false,
  })
  @UpdateDateColumn({ nullable: false })
  public updatedAt!: Date;

  /**
   * The constructor for the Report entity.
   *
   * @param content - The content of the report.
   * @param guid - The global unique id of the item reported.
   */
  public constructor(content: string, guid: string) {
    this.content = content;
    this.guid = guid;
  }
}
