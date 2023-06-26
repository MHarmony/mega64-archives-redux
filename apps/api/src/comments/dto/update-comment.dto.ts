import { UpdateComment } from '@mega64/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

/**
 * The Data transfer object (DTO) for udpating a comment.
 */
export class UpdateCommentDto implements UpdateComment {
  /**
   * The new content of the comment.
   *
   * @decorator `@ApiProperty`
   * @decorator `@IsString`
   * @decorator `@IsNotEmpty`
   * @decorator `@MaxLength`
   */
  @ApiProperty({
    description: 'The new content of the comment.',
    example: 'This video still rulez!',
    maxLength: 10000,
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  public content!: string;
}
