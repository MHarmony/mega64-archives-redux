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
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { Reply } from './entities/reply.entity';
import { RepliesService } from './replies.service';

/**
 * The Replies controller.
 *
 * @decorator `@ApiReplies`
 * @decorator `@Controller`
 */
@ApiTags('replies')
@Controller('replies')
export class RepliesController {
  /**
   * The constructor for RepliesController.
   *
   * @param repliesService - The RepliesService.
   */
  constructor(private readonly repliesService: RepliesService) {}

  /**
   * Creates a new reply.
   *
   * @decorator `@ApiBearerAuth`
   * @decorator `@ApiOperation`
   * @decorator `@ApiBody`
   * @decorator `@ApiCreatedResponse`
   * @decorator `@ApiBadRequestResponse`
   * @decorator `@UseGuards`
   * @decorator `@Post`
   *
   * @param createReplyDto - The DTO with the data to create the reply with.
   *
   * @returns The newly created reply.
   */
  @ApiBearerAuth('jwt')
  @ApiOperation({
    description: 'Creates a new reply.',
    summary: 'Creates a new reply.',
  })
  @ApiBody({
    description: 'The DTO with the data to create the reply with.',
    required: true,
    type: CreateReplyDto,
  })
  @ApiCreatedResponse({
    description: 'Successfully created a new reply.',
    type: Reply,
  })
  @ApiBadRequestResponse({
    description: 'The DTO is invalid.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  public async create(@Body() createReplyDto: CreateReplyDto): Promise<Reply> {
    return this.repliesService.create(createReplyDto);
  }

  /**
   * Finds all replies.
   *
   * @decorator `@ApiBearerAuth`
   * @decorator `@ApiOperation`
   * @decorator `@ApiOkResponse`
   * @decorator `@ApiUnauthorizedResponse`
   * @decorator `@UseGuards`
   * @decorator `@Get`
   *
   * @returns An array of all replies.
   */
  @ApiBearerAuth('jwt')
  @ApiOperation({
    description: 'Finds all replies.',
    summary: 'Finds all replies.',
  })
  @ApiOkResponse({
    description: 'Successfully found all replies.',
    type: [Reply],
  })
  @ApiUnauthorizedResponse({
    description: 'Please login before calling this endpoint.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  public async findAll(): Promise<Reply[]> {
    return this.repliesService.findAll();
  }

  /**
   * Finds a reply by its content.
   *
   * @decorator `@ApiBearerAuth`
   * @decorator `@ApiOperation`
   * @decorator `@ApiParam`
   * @decorator `@ApiOkResponse`
   * @decorator `@ApiNotFoundResponse`
   * @decorator `@UseGuards`
   * @decorator `@Get`
   *
   * @param content - The content of the reply to find.
   *
   * @returns The reply with the provided content.
   */
  @ApiBearerAuth('jwt')
  @ApiOperation({
    description: 'Finds a reply by its content.',
    summary: 'Finds a reply by its content.',
  })
  @ApiParam({
    allowEmptyValue: false,
    description: 'The content of the reply to find.',
    example: 'john.doe@gmail.com',
    name: 'content',
    required: true,
    type: String,
  })
  @ApiOkResponse({
    description: 'Successfully found the reply with the provided content.',
    type: Reply,
  })
  @ApiNotFoundResponse({
    description: 'Could not find the reply with the provided content.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('/byContent/:content')
  public async findOneByContent(
    @Param('content') content: string,
  ): Promise<Reply> {
    return this.repliesService.findOneByContent(content);
  }

  /**
   * Finds a reply by its id.
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
   * @param id - The id of the reply to find.
   *
   * @returns The reply with the provided id.
   */
  @ApiBearerAuth('jwt')
  @ApiOperation({
    description: 'Finds a reply by its id.',
    summary: 'Finds a reply by its id.',
  })
  @ApiParam({
    allowEmptyValue: false,
    description: 'The id of the reply to find.',
    example: 1,
    name: 'id',
    required: true,
    type: Number,
  })
  @ApiOkResponse({
    description: 'Successfully found the reply with the provided id.',
    type: Reply,
  })
  @ApiNotFoundResponse({
    description: 'Could not find the reply with the provided id.',
  })
  @ApiUnauthorizedResponse({
    description: 'Please login before calling this endpoint.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('/byId/:id')
  public async findOneById(@Param('id') id: string): Promise<Reply> {
    return this.repliesService.findOneById(+id);
  }

  /**
   * Updates the content and/or name of the reply with the provided id.
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
   * @param id - The id of the reply to update.
   * @param updateReplyDto - The DTO with the data to update the reply with.
   *
   * @returns The updated reply
   */
  @ApiBearerAuth('jwt')
  @ApiOperation({
    description:
      'Updates the content and/or name of the reply with the provided id.',
    summary:
      'Updates the content and/or name of the reply with the provided id.',
  })
  @ApiParam({
    allowEmptyValue: false,
    description: 'The id of the reply to update.',
    example: 1,
    name: 'id',
    required: true,
    type: Number,
  })
  @ApiBody({
    description: 'The DTO with the data to update the reply with.',
    required: true,
    type: UpdateReplyDto,
  })
  @ApiOkResponse({
    description: 'Successfully updated the reply with the provided data.',
    type: Reply,
  })
  @ApiNotFoundResponse({
    description: 'Could not find the reply with the provided id.',
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
    @Body() updateReplyDto: UpdateReplyDto,
  ): Promise<Reply> {
    return this.repliesService.update(+id, updateReplyDto);
  }

  /**
   * Removes a reply.
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
   * @param id - The id of the reply to remove.
   */
  @ApiBearerAuth('jwt')
  @ApiOperation({
    description: 'Removes a reply.',
    summary: 'Removes a reply.',
  })
  @ApiParam({
    allowEmptyValue: false,
    description: 'The id of the reply to remove.',
    example: 1,
    name: 'id',
    required: true,
    type: Number,
  })
  @ApiOkResponse({
    description: 'Successfully removed the reply with the provided id.',
    type: Reply,
  })
  @ApiNotFoundResponse({
    description: 'Could not find the reply with the provided id.',
  })
  @ApiUnauthorizedResponse({
    description: 'Please login before calling this endpoint.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<void> {
    return this.repliesService.remove(+id);
  }
}
