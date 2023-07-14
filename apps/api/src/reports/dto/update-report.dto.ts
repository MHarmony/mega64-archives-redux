import { UpdateReport } from '@mega64/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator/types';

/**
 * The Data transfer object (DTO) for updating a report.
 */
export class UpdateReportDto implements UpdateReport {
  /**
   * The new resolution flag of the report.
   *
   * @decorator `@ApiProperty`
   * @decorator `@IsOptional`
   * @decorator `@IsBoolean`
   */
  @ApiProperty({
    description: 'The new resolution flag of the report.',
    example: false,
    nullable: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  public resolved?: boolean;

  /**
   * The new content of the report.
   *
   * @decorator `@ApiProperty`
   * @decorator `@IsOptional`
   * @decorator `@IsString`
   * @decorator `@IsNotEmpty`
   * @decorator `@MaxLength`
   */
  @ApiProperty({
    description: 'The new content of the report.',
    example: 'This video is mean!',
    maxLength: 10000,
    nullable: false,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  public content?: string;
}
