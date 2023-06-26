import { IncludeUser } from '@mega64/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

/**
 * The Data transfer object (DTO) for including a user.
 */
export class IncludeUserDto implements IncludeUser {
  /**
   * The unique id of the user.
   *
   * @decorator `@ApiProperty`
   * @decorator `@IsNumber`
   * @decorator `@IsPositive`
   */
  @ApiProperty({
    description: 'The unique id of the user.',
    example: '1',
    nullable: false,
  })
  @IsNumber()
  @IsPositive()
  public id!: number;
}
