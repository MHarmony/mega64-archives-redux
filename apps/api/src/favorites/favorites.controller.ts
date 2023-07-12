import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { Favorite } from './entities/favorite.entity';
import { FavoritesService } from './favorites.service';

/**
 * The Favorites controller.
 *
 * @decorator `@ApiTags`
 * @decorator `@Controller`
 */
@ApiTags('favorites')
@Controller('favorites')
export class FavoritesController {
  /**
   * The constructor for FavoritesController.
   *
   * @param favoritesService - The FavoritesService.
   */
  constructor(private readonly favoritesService: FavoritesService) {}

  /**
   * Creates a new favorite.
   *
   * @decorator `@ApiBearerAuth`
   * @decorator `@ApiOperation`
   * @decorator `@ApiBody`
   * @decorator `@ApiCreatedResponse`
   * @decorator `@ApiBadRequestResponse`
   * @decorator `@UseGuards`
   * @decorator `@Post`
   *
   * @param createFavoriteDto - The DTO with the data to create the favorite with.
   *
   * @returns The newly created favorite.
   */
  @ApiBearerAuth('jwt')
  @ApiOperation({
    description: 'Creates a new favorite.',
    summary: 'Creates a new favorite.',
  })
  @ApiBody({
    description: 'The DTO with the data to create the favorite with.',
    required: true,
    type: CreateFavoriteDto,
  })
  @ApiCreatedResponse({
    description: 'Successfully created a new favorite.',
    type: Favorite,
  })
  @ApiBadRequestResponse({
    description: 'The DTO is invalid.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  public async create(
    @Body() createFavoriteDto: CreateFavoriteDto,
  ): Promise<Favorite> {
    return this.favoritesService.create(createFavoriteDto);
  }

  /**
   * Finds all favorites.
   *
   * @decorator `@ApiBearerAuth`
   * @decorator `@ApiOperation`
   * @decorator `@ApiOkResponse`
   * @decorator `@ApiUnauthorizedResponse`
   * @decorator `@UseGuards`
   * @decorator `@Get`
   *
   * @returns An array of all favorites.
   */
  @ApiBearerAuth('jwt')
  @ApiOperation({
    description: 'Finds all favorites.',
    summary: 'Finds all favorites.',
  })
  @ApiOkResponse({
    description: 'Successfully found all favorites.',
    type: [Favorite],
  })
  @ApiUnauthorizedResponse({
    description: 'Please login before calling this endpoint.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  public async findAll(): Promise<Favorite[]> {
    return this.favoritesService.findAll();
  }

  /**
   * Finds a favorite by its id.
   *
   * @decorator `@ApiBearerAuth`
   * @decorator `@ApiOperation`
   * @decorator `@ApiParam`
   * @decorator `@ApiOkResponse`
   * @decorator `@ApiNotFoundResponse`
   * @decorator `@ApiUnauthorizedResponse`
   * @decorator `@UseGuards`
   * @decorator `@Get`
   *
   * @param id - The id of the favorite to find.
   *
   * @returns The favorite with the provided id.
   */
  @ApiBearerAuth('jwt')
  @ApiOperation({
    description: 'Finds a favorite by its id.',
    summary: 'Finds a favorite by its id.',
  })
  @ApiParam({
    allowEmptyValue: false,
    description: 'The id of the favorite to find.',
    example: 1,
    name: 'id',
    required: true,
    type: Number,
  })
  @ApiOkResponse({
    description: 'Successfully found the favorite with the provided id.',
    type: Favorite,
  })
  @ApiNotFoundResponse({
    description: 'Could not find the favorite with the provided id.',
  })
  @ApiUnauthorizedResponse({
    description: 'Please login before calling this endpoint.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('/byId/:id')
  public async findOneById(@Param('id') id: string): Promise<Favorite> {
    return this.favoritesService.findOneById(+id);
  }

  /**
   * Removes a favorite.
   *
   * @decorator `@ApiBearerAuth`
   * @decorator `@ApiOperation`
   * @decorator `@ApiParam`
   * @decorator `@ApiOkResponse`
   * @decorator `@ApiNotFoundResponse`
   * @decorator `@ApiUnauthorizedResponse`
   * @decorator `@UseGuards`
   * @decorator `@Delete`
   *
   * @param id - The id of the favorite to remove.
   */
  @ApiBearerAuth('jwt')
  @ApiOperation({
    description: 'Removes a favorite.',
    summary: 'Removes a favorite.',
  })
  @ApiParam({
    allowEmptyValue: false,
    description: 'The id of the favorite to remove.',
    example: 1,
    name: 'id',
    required: true,
    type: Number,
  })
  @ApiOkResponse({
    description: 'Successfully removed the favorite with the provided id.',
    type: Favorite,
  })
  @ApiNotFoundResponse({
    description: 'Could not find the favorite with the provided id.',
  })
  @ApiUnauthorizedResponse({
    description: 'Please login before calling this endpoint.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<void> {
    return this.favoritesService.remove(+id);
  }
}
