import { CreateFavorite } from '@mega64/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyObject } from 'class-validator/types';
import { IncludeMediaDto } from '../../medias/dto/include-media.dto';
import { Media } from '../../medias/entities/media.entity';
import { IncludeUserDto } from '../../users/dto/include-user.dto';

/**
 * The Data transfer object (DTO) for creating a favorite.
 */
export class CreateFavoriteDto implements CreateFavorite {
  /**
   * The favorited media
   *
   * @decorator `@ApiProperty`
   * @decorator `@IsNotEmptyObject`
   */
  @ApiProperty({
    description: 'The favorited media.',
    nullable: false,
    type: Media,
  })
  @IsNotEmptyObject()
  public media!: IncludeMediaDto;

  /**
   * The user who created the favorite.
   *
   * @decorator `@ApiProperty`
   * @decorator `@IsNotEmptyObject`
   */
  @ApiProperty({
    description: 'The user who is creating the favorite.',
    example: { id: '1' },
    nullable: false,
    type: IncludeUserDto,
  })
  @IsNotEmptyObject()
  public user!: IncludeUserDto;
}
