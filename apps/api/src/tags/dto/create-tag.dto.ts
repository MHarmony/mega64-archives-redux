import { CreateTag } from '@mega64/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { IncludeUserDto } from '../../users/dto/include-user.dto';

/**
 * The Data transfer object (DTO) for creating a tag.
 */
export class CreateTagDto implements CreateTag {
  /**
   * The content of the new tag.
   *
   * @decorator `@ApiProperty`
   * @decorator `@IsString`
   * @decorator `@IsAlphaNumeric`
   * @decorator `@Length`
   */
  @ApiProperty({
    description: 'The content of the tag.',
    example: 'new shawn',
    maxLength: 30,
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsAlphanumeric()
  @Length(1, 30)
  public content!: string;

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
  @IsUUID()
  public itemGuid!: string;

  /**
   * The user who created the tag.
   *
   * @decorator `@ApiProperty`
   * @decorator `@IsNotEmptyObject`
   */
  @ApiProperty({
    description: 'The user who is creating the tag.',
    example: { id: '1' },
    nullable: false,
    type: IncludeUserDto,
  })
  @IsNotEmptyObject()
  public user!: IncludeUserDto;
}
