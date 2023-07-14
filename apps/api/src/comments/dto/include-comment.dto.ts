import { IncludeComment } from '@mega64/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator/types';

/**
 * The Data transfer object (DTO) for including a comment.
 */
export class IncludeCommentDto implements IncludeComment {
  /**
   * The unique id of the comment.
   *
   * @decorator `@ApiProperty`
   * @decorator `@IsNumber`
   * @decorator `@IsPositive`
   */
  @ApiProperty({
    description: 'The unique id of the comment.',
    example: '1',
    nullable: false,
  })
  @IsNumber()
  @IsPositive()
  public id!: number;
}
