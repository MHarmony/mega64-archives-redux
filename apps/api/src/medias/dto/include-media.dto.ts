import { IncludeMedia } from '@mega64/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

/**
 * The Data transfer object (DTO) for including media.
 */
export class IncludeMediaDto implements IncludeMedia {
  /**
   * The unique id of the media.
   *
   * @decorator `@ApiProperty`
   * @decorator `@IsNumber`
   * @decorator `@IsPositive`
   */
  @ApiProperty({
    description: 'The unique id of the media.',
    example: '1',
    nullable: false,
  })
  @IsNumber()
  @IsPositive()
  public id!: number;
}
