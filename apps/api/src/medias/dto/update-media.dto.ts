import { UpdateMedia } from '@mega64/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

/**
 * The Data transfer object (DTO) for updating media.
 */
export class UpdateMediaDto implements UpdateMedia {
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
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsAlphanumeric()
  @Length(1, 50)
  public title?: string;

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
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  @Length(1, 255)
  public link?: string;
}
