import { UpdateTag } from '@mega64/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsString, Length } from 'class-validator/types';

/**
 * The Data transfer object (DTO) for udpating a tag.
 */
export class UpdateTagDto implements UpdateTag {
  /**
   * The new content of the tag.
   *
   * @decorator `@ApiProperty`
   * @decorator `@IsString`
   * @decorator `@IsAlphaNumeric`
   * @decorator `@Length`
   */
  @ApiProperty({
    description: 'The new content of the tag.',
    example: 'new shawn',
    maxLength: 30,
    nullable: false,
    required: true,
  })
  @IsString()
  @IsAlphanumeric()
  @Length(1, 30)
  public content!: string;
}
