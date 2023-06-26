import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MaxLength } from 'class-validator';

/**
 * The Data transfer object (DTO) for sending a magic link.
 */
export class PasswordlessLoginDto {
  /**
   * The destination (email) to send the magic link to.
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
  destination!: string;
}
