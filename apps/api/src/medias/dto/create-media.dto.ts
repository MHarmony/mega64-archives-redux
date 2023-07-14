import { CreateMedia, MediaType } from '@mega64/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer/types';
import {
  IsAlphanumeric,
  IsAscii,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator/types';

/**
 * The Data transfer object (DTO) for creating media.
 */
export class CreateMediaDto implements CreateMedia {
  /**
   * The new title of the media.
   *
   * @decorator `@ApiProperty`
   * @decorator `@IsOptional`
   * @decorator `@IsString`
   * @decorator `@IsAlphanumeric`
   * @decorator `@Length`
   */
  @ApiProperty({
    description: 'The new title of the media.',
    example: 'Podcast 120',
    maxLength: 50,
    nullable: false,
  })
  @IsOptional()
  @IsString()
  @IsAscii()
  @Length(1, 50)
  public title!: string;

  /**
   * The new description of the media.
   *
   * @decorator `@ApiProperty`
   * @decorator `@IsOptional`
   * @decorator `@IsString`
   * @decorator `@IsAlphanumeric`
   * @decorator `@Length`
   */
  @ApiProperty({
    description: 'The new description of the media.',
    example: 'This is podcast 120',
    maxLength: 255,
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsAlphanumeric()
  @Length(1, 255)
  public description?: string;

  /**
   * The new link to the media.
   *
   * @decorator `@ApiProperty`
   * @decorator `@IsOptional`
   * @decorator `@IsString`
   * @decorator `@IsAlphanumeric`
   * @decorator `@Length`
   */
  @ApiProperty({
    description: 'The new link to the media.',
    example: 'https://link.to.media',
    maxLength: 255,
    nullable: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  @Length(1, 255)
  public link!: string;

  /**
   * The type of the media.
   *
   * @decorator `@ApiProperty`
   * @decorator `@IsEnum`
   */
  @ApiProperty({
    description: 'The type of the media.',
    enum: MediaType,
    example: MediaType.PODCAST_VIDEO,
    nullable: false,
  })
  @IsEnum(MediaType)
  public type!: MediaType;

  /**
   * The date the actual content was released.
   *
   * @decorator `@ApiProperty`
   * @decorator `@IsDateString`
   */
  @ApiProperty({
    description: 'The date the actual content was released.',
    example: new Date(),
    nullable: false,
  })
  @IsDate()
  @Type(() => Date)
  public releaseDate!: Date;
}
