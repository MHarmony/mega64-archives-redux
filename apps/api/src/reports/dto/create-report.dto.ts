import { CreateReport } from '@mega64/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator/types';
import { v4 as uuidv4 } from 'uuid';
import { IncludeUserDto } from '../../users/dto/include-user.dto';

/**
 * The Data transfer object (DTO) for creating a report.
 */
export class CreateReportDto implements CreateReport {
  /**
   * The global unique id of the content to report.
   *
   * @decorator `@ApiProperty`
   * @decorator `@IsUUID`
   */
  @ApiProperty({
    description: 'The global unique id of the content to report.',
    example: uuidv4(),
    nullable: false,
  })
  @IsUUID()
  public guid!: string;

  /**
   * The content of the new report.
   *
   * @decorator `@ApiProperty`
   * @decorator `@IsString`
   * @decorator `@IsNotEmpty`
   * @decorator `@MaxLength`
   */
  @ApiProperty({
    description: 'The content of the new report.',
    example: 'This video is mean!',
    maxLength: 10000,
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  public content!: string;

  /**
   * The user who created the report.
   *
   * @decorator `@ApiProperty`
   * @decorator `@IsNotEmptyObject`
   */
  @ApiProperty({
    description: 'The user who is creating the report.',
    example: { id: '1' },
    nullable: false,
    type: IncludeUserDto,
  })
  @IsNotEmptyObject()
  public user!: IncludeUserDto;
}
