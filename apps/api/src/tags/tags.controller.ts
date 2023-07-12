import {
  Body,
  Controller,
  Delete,
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
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
import { TagsService } from './tags.service';

/**
 * The Tags controller.
 *
 * @decorator `@ApiTags`
 * @decorator `@Controller`
 */
@ApiTags('tags')
@Controller('tags')
export class TagsController {
  /**
   * The constructor for TagsController.
   *
   * @param tagsService - The TagsService.
   */
  constructor(private readonly tagsService: TagsService) {}

  /**
   * Creates a new tag.
   *
   * @decorator `@ApiBearerAuth`
   * @decorator `@ApiOperation`
   * @decorator `@ApiBody`
   * @decorator `@ApiCreatedResponse`
   * @decorator `@ApiBadRequestResponse`
   * @decorator `@UseGuards`
   * @decorator `@Post`
   *
   * @param createTagDto - The DTO with the data to create the tag with.
   *
   * @returns The newly created tag.
   */
  @ApiBearerAuth('jwt')
  @ApiOperation({
    description: 'Creates a new tag.',
    summary: 'Creates a new tag.',
  })
  @ApiBody({
    description: 'The DTO with the data to create the tag with.',
    required: true,
    type: CreateTagDto,
  })
  @ApiCreatedResponse({
    description: 'Successfully created a new tag.',
    type: Tag,
  })
  @ApiBadRequestResponse({
    description: 'The DTO is invalid.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  public async create(@Body() createTagDto: CreateTagDto): Promise<Tag> {
    return this.tagsService.create(createTagDto);
  }

  /**
   * Finds all tags.
   *
   * @decorator `@ApiBearerAuth`
   * @decorator `@ApiOperation`
   * @decorator `@ApiOkResponse`
   * @decorator `@ApiUnauthorizedResponse`
   * @decorator `@UseGuards`
   * @decorator `@Get`
   *
   * @returns An array of all tags.
   */
  @ApiBearerAuth('jwt')
  @ApiOperation({
    description: 'Finds all tags.',
    summary: 'Finds all tags.',
  })
  @ApiOkResponse({
    description: 'Successfully found all tags.',
    type: [Tag],
  })
  @ApiUnauthorizedResponse({
    description: 'Please login before calling this endpoint.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  public async findAll(): Promise<Tag[]> {
    return this.tagsService.findAll();
  }

  /**
   * Finds a tag by its content.
   *
   * @decorator `@ApiBearerAuth`
   * @decorator `@ApiOperation`
   * @decorator `@ApiParam`
   * @decorator `@ApiOkResponse`
   * @decorator `@ApiNotFoundResponse`
   * @decorator `@UseGuards`
   * @decorator `@Get`
   *
   * @param content - The content of the tag to find.
   *
   * @returns The tag with the provided content.
   */
  @ApiBearerAuth('jwt')
  @ApiOperation({
    description: 'Finds a tag by its content.',
    summary: 'Finds a tag by its content.',
  })
  @ApiParam({
    allowEmptyValue: false,
    description: 'The content of the tag to find.',
    example: 'john.doe@gmail.com',
    name: 'content',
    required: true,
    type: String,
  })
  @ApiOkResponse({
    description: 'Successfully found the tag with the provided content.',
    type: Tag,
  })
  @ApiNotFoundResponse({
    description: 'Could not find the tag with the provided content.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('/byContent/:content')
  public async findOneByContent(
    @Param('content') content: string,
  ): Promise<Tag> {
    return this.tagsService.findOneByContent(content);
  }

  /**
   * Finds a tag by its id.
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
   * @param id - The id of the tag to find.
   *
   * @returns The tag with the provided id.
   */
  @ApiBearerAuth('jwt')
  @ApiOperation({
    description: 'Finds a tag by its id.',
    summary: 'Finds a tag by its id.',
  })
  @ApiParam({
    allowEmptyValue: false,
    description: 'The id of the tag to find.',
    example: 1,
    name: 'id',
    required: true,
    type: Number,
  })
  @ApiOkResponse({
    description: 'Successfully found the tag with the provided id.',
    type: Tag,
  })
  @ApiNotFoundResponse({
    description: 'Could not find the tag with the provided id.',
  })
  @ApiUnauthorizedResponse({
    description: 'Please login before calling this endpoint.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('/byId/:id')
  public async findOneById(@Param('id') id: string): Promise<Tag> {
    return this.tagsService.findOneById(+id);
  }

  /**
   * Updates the content and/or name of the tag with the provided id.
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
   * @param id - The id of the tag to update.
   * @param updateTagDto - The DTO with the data to update the tag with.
   *
   * @returns The updated tag
   */
  @ApiBearerAuth('jwt')
  @ApiOperation({
    description:
      'Updates the content and/or name of the tag with the provided id.',
    summary: 'Updates the content and/or name of the tag with the provided id.',
  })
  @ApiParam({
    allowEmptyValue: false,
    description: 'The id of the tag to update.',
    example: 1,
    name: 'id',
    required: true,
    type: Number,
  })
  @ApiBody({
    description: 'The DTO with the data to update the tag with.',
    required: true,
    type: UpdateTagDto,
  })
  @ApiOkResponse({
    description: 'Successfully updated the tag with the provided data.',
    type: Tag,
  })
  @ApiNotFoundResponse({
    description: 'Could not find the tag with the provided id.',
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
    @Body() updateTagDto: UpdateTagDto,
  ): Promise<Tag> {
    return this.tagsService.update(+id, updateTagDto);
  }

  /**
   * Removes a tag.
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
   * @param id - The id of the tag to remove.
   */
  @ApiBearerAuth('jwt')
  @ApiOperation({
    description: 'Removes a tag.',
    summary: 'Removes a tag.',
  })
  @ApiParam({
    allowEmptyValue: false,
    description: 'The id of the tag to remove.',
    example: 1,
    name: 'id',
    required: true,
    type: Number,
  })
  @ApiOkResponse({
    description: 'Successfully removed the tag with the provided id.',
    type: Tag,
  })
  @ApiNotFoundResponse({
    description: 'Could not find the tag with the provided id.',
  })
  @ApiUnauthorizedResponse({
    description: 'Please login before calling this endpoint.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<void> {
    return this.tagsService.remove(+id);
  }
}
