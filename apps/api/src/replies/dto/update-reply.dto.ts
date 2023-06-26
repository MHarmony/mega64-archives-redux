import { UpdateReply } from '@mega64/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

/**
 * The Data transfer object (DTO) for udpating a reply.
 */
export class UpdateReplyDto implements UpdateReply {
  /**
   * The reply of the new comment.
   *
   * @decorator `@ApiProperty`
   * @decorator `@IsString`
   * @decorator `@IsNotEmpty`
   * @decorator `@MaxLength`
   */
  @ApiProperty({
    description: 'The new content of the reply.',
    example: 'This video still rulez!',
    maxLength: 10000,
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  public content!: string;
}
