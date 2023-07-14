import { CreateUser } from '@mega64/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsString,
  Length,
  MaxLength,
  NotContains,
} from 'class-validator/types';

/**
 * The Data transfer object (DTO) for creating a user.
 */
export class CreateUserDto implements CreateUser {
  /**
   * The email of the new user.
   *
   * @decorator `@ApiProperty`
   * @decorator `@IsEmail`
   * @decorator `@MaxLength`
   */
  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@gmail.com',
    maxLength: 254,
    nullable: false,
  })
  @IsEmail()
  @MaxLength(254)
  public email!: string;

  /**
   * The name of the new user.
   *
   * @decorator `@ApiProperty`
   * @decorator `@IsString`
   * @decorator `@IsAlphanumeric`
   * @decorator `@NotContains`
   * @decorator `@Length`
   */
  @ApiProperty({
    description: 'The name of the user',
    example: 'johndoe',
    maxLength: 30,
    nullable: false,
  })
  @IsString()
  @IsAlphanumeric()
  @NotContains(' ')
  @Length(1, 30)
  public name!: string;
}
