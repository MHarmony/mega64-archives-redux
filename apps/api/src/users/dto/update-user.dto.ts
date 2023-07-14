import { UpdateUser, UserType } from '@mega64/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  NotContains,
} from 'class-validator/types';

/**
 * The Data transfer object (DTO) for updating a user.
 */
export class UpdateUserDto implements UpdateUser {
  /**
   * The new email of the user.
   *
   * @decorator `@ApiProperty`
   * @decorator `@IsOptional`
   * @decorator `@IsEmail`
   * @decorator `@MaxLength`
   */
  @ApiProperty({
    description: 'The new email of the user',
    example: 'john.doe@gmail.com',
    maxLength: 254,
    nullable: false,
    required: false,
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(254)
  public email?: string;

  /**
   * The new name of the user.
   *
   * @decorator `@ApiProperty`
   * @decorator `@IsOptional`
   * @decorator `@IsString`
   * @decorator `@IsAlphanumeric`
   * @decorator `@NotContains`
   * @decorator `@Length`
   */
  @ApiProperty({
    description: 'The new name of the user',
    example: 'johndoe',
    maxLength: 30,
    nullable: false,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsAlphanumeric()
  @NotContains(' ')
  @Length(1, 30)
  public name?: string;

  /**
   * The new type of the user.
   *
   * @decorator `@ApiProperty`
   * @decorator `@IsOptional`
   * @decorator `@IsEnum`
   */
  @ApiProperty({
    description: 'The new type of the user',
    example: UserType.MODERATOR,
    nullable: false,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserType)
  public type?: string;
}
