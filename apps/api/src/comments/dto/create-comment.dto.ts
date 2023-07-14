import { CreateComment } from '@mega64/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  MaxLength,
} from 'class-validator/types';
import { IncludeUserDto } from '../../users/dto/include-user.dto';

/**
 * The Data transfer object (DTO) for creating a comment.
 */
export class CreateCommentDto implements CreateComment {
  /**
   * The content of the new comment.
   *
   * @decorator `@ApiProperty`
   * @decorator `@IsString`
   * @decorator `@IsNotEmpty`
   * @decorator `@MaxLength`
   */
  @ApiProperty({
    description: 'The content of the comment.',
    example: 'This video rulez!',
    maxLength: 10000,
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  public content!: string;

  /**
   * The user who created the comment.
   *
   * @decorator `@ApiProperty`
   * @decorator `@IsNotEmptyObject`
   */
  @ApiProperty({
    description: 'The user who is creating the comment.',
    example: { id: '1' },
    nullable: false,
    type: IncludeUserDto,
  })
  @IsNotEmptyObject()
  public user!: IncludeUserDto;
}
