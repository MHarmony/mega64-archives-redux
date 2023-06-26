import { CreateReply } from '@mega64/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  MaxLength,
} from 'class-validator';
import { IncludeCommentDto } from '../../comments/dto/include-comment.dto';
import { IncludeUserDto } from '../../users/dto/include-user.dto';

/**
 * The Data transfer object (DTO) for creating a reply.
 */
export class CreateReplyDto implements CreateReply {
  /**
   * The content of the new reply.
   *
   * @decorator `@ApiProperty`
   * @decorator `@IsString`
   * @decorator `@IsNotEmpty`
   * @decorator `@MaxLength`
   */
  @ApiProperty({
    description: 'The content of the reply.',
    example: 'This video rulez!',
    maxLength: 10000,
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  public content!: string;

  /**
   * The user who created the reply.
   *
   * @decorator `@ApiProperty`
   * @decorator `@IsNotEmptyObject`
   */
  @ApiProperty({
    description: 'The user who is creating the reply.',
    example: { id: '1' },
    nullable: false,
    type: IncludeUserDto,
  })
  @IsNotEmptyObject()
  public user!: IncludeUserDto;

  /**
   * The parent comment.
   *
   * @decorator `@ApiProperty`
   * @decorator `@IsNotEmptyObject`
   */
  @ApiProperty({
    description: 'The parent comment.',
    example: { id: '1' },
    nullable: false,
    type: IncludeCommentDto,
  })
  @IsNotEmptyObject()
  public parentComment!: IncludeCommentDto;
}
