import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { Media } from './entities/media.entity';
import { MediasService } from './medias.service';

/**
 * The Medias controller.
 *
 * @decorator `@ApiTags`
 * @decorator `@Controller`
 */
@ApiTags('medias')
@Controller('medias')
export class MediasController {
  /**
   * The constructor for MediasController.
   *
   * @param mediasService - The MediasService.
   */
  constructor(private readonly mediasService: MediasService) {}

  /**
   * Creates a new media.
   *
   * @decorator `@ApiExcludeEndpoint`
   * @decorator `@ApiBearerAuth`
   * @decorator `@ApiOperation`
   * @decorator `@ApiBody`
   * @decorator `@ApiCreatedResponse`
   * @decorator `@ApiBadRequestResponse`
   * @decorator `@UseGuards`
   * @decorator `@Post`
   *
   * @param createFavoriteDto - The DTO with the data to create the media with.
   *
   * @returns The newly created media.
   */
  @ApiExcludeEndpoint()
  @ApiBearerAuth('jwt')
  @ApiOperation({
    description: 'Creates a new media.',
    summary: 'Creates a new media.',
  })
  @ApiBody({
    description: 'The DTO with the data to create the media with.',
    required: true,
    type: CreateMediaDto,
  })
  @ApiCreatedResponse({
    description: 'Successfully created a new media.',
    type: Media,
  })
  @ApiBadRequestResponse({
    description: 'The DTO is invalid.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  public async create(@Body() createMediaDto: CreateMediaDto): Promise<Media> {
    return this.mediasService.create(createMediaDto);
  }

  /**
   * Finds all medias.
   *
   * @decorator `@ApiBearerAuth`
   * @decorator `@ApiOperation`
   * @decorator `@ApiOkResponse`
   * @decorator `@ApiUnauthorizedResponse`
   * @decorator `@UseGuards`
   * @decorator `@Get`
   *
   * @returns An array of all medias.
   */
  @ApiBearerAuth('jwt')
  @ApiOperation({
    description: 'Finds all medias.',
    summary: 'Finds all medias.',
  })
  @ApiOkResponse({
    description: 'Successfully found all medias.',
    type: [Media],
  })
  @ApiUnauthorizedResponse({
    description: 'Please login before calling this endpoint.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  public async findAll(): Promise<Media[]> {
    return this.mediasService.findAll();
  }

  /**
   * Finds a media by its title.
   *
   * @decorator `@ApiBearerAuth`
   * @decorator `@ApiOperation`
   * @decorator `@ApiParam`
   * @decorator `@ApiOkResponse`
   * @decorator `@ApiNotFoundResponse`
   * @decorator `@UseGuards`
   * @decorator `@Get`
   *
   * @param title - The title of the media to find.
   *
   * @returns The media with the provided title.
   */
  @ApiBearerAuth('jwt')
  @ApiOperation({
    description: 'Finds a media by its title.',
    summary: 'Finds a media by its title.',
  })
  @ApiParam({
    allowEmptyValue: false,
    description: 'The title of the media to find.',
    example: 'Podcast 102',
    name: 'title',
    required: true,
    type: String,
  })
  @ApiOkResponse({
    description: 'Successfully found the media with the provided title.',
    type: Media,
  })
  @ApiNotFoundResponse({
    description: 'Could not find the media with the provided title.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('/bytitle/:title')
  public async findOneBytitle(@Param('title') title: string): Promise<Media> {
    return this.mediasService.findOneByTitle(title);
  }

  /**
   * Finds a media by its id.
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
   * @param id - The id of the media to find.
   *
   * @returns The media with the provided id.
   */
  @ApiBearerAuth('jwt')
  @ApiOperation({
    description: 'Finds a media by its id.',
    summary: 'Finds a media by its id.',
  })
  @ApiParam({
    allowEmptyValue: false,
    description: 'The id of the media to find.',
    example: 1,
    name: 'id',
    required: true,
    type: Number,
  })
  @ApiOkResponse({
    description: 'Successfully found the media with the provided id.',
    type: Media,
  })
  @ApiNotFoundResponse({
    description: 'Could not find the media with the provided id.',
  })
  @ApiUnauthorizedResponse({
    description: 'Please login before calling this endpoint.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('/byId/:id')
  public async findOneById(@Param('id') id: string): Promise<Media> {
    return this.mediasService.findOneById(+id);
  }

  /**
   * Updates the content and/or name of the media with the provided id.
   *
   * @decorator `@ApiBearerAuth`
   * @decorator `@ApiOperation`
   * @decorator `@ApiParam`
   * @decorator `@ApiBody`
   * @decorator `@ApiOkResponse`
   * @decorator `@ApiNotFoundResponse`
   * @decorator `@ApiBadRequestResponse`
   * @decorator `@ApiUnauthorizedResponse`
   * @decorator `@UseGuards`
   * @decorator `@Patch`
   *
   * @param id - The id of the media to update.
   * @param updateMediaDto - The DTO with the data to update the media with.
   *
   * @returns The updated media
   */
  @ApiBearerAuth('jwt')
  @ApiOperation({
    description:
      'Updates the title, description, or link of a media with the provided id.',
    summary:
      'Updates the title, description, or link of a media with the provided id.',
  })
  @ApiParam({
    allowEmptyValue: false,
    description: 'The id of the media to update.',
    example: 1,
    name: 'id',
    required: true,
    type: Number,
  })
  @ApiBody({
    description: 'The DTO with the data to update the media with.',
    required: true,
    type: UpdateMediaDto,
  })
  @ApiOkResponse({
    description: 'Successfully updated the media with the provided data.',
    type: Media,
  })
  @ApiNotFoundResponse({
    description: 'Could not find the media with the provided id.',
  })
  @ApiBadRequestResponse({
    description: 'The DTO is invalid.',
  })
  @ApiUnauthorizedResponse({
    description: 'Please login before calling this endpoint.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateMediaDto: UpdateMediaDto
  ): Promise<Media> {
    return this.mediasService.update(+id, updateMediaDto);
  }
}
