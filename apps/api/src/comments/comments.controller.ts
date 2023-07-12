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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

/**
 * The Comments controller.
 *
 * @decorator `@ApiComments`
 * @decorator `@Controller`
 */
@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  /**
   * The constructor for CommentsController.
   *
   * @param commentsService - The CommentsService.
   */
  constructor(private readonly commentsService: CommentsService) {}

  /**
   * Creates a new comment.
   *
   * @decorator `@ApiBearerAuth`
   * @decorator `@ApiOperation`
   * @decorator `@ApiBody`
   * @decorator `@ApiCreatedResponse`
   * @decorator `@ApiBadRequestResponse`
   * @decorator `@UseGuards`
   * @decorator `@Post`
   *
   * @param createCommentDto - The DTO with the data to create the comment with.
   *
   * @returns The newly created comment.
   */
  @ApiBearerAuth('jwt')
  @ApiOperation({
    description: 'Creates a new comment.',
    summary: 'Creates a new comment.',
  })
  @ApiBody({
    description: 'The DTO with the data to create the comment with.',
    required: true,
    type: CreateCommentDto,
  })
  @ApiCreatedResponse({
    description: 'Successfully created a new comment.',
    type: Comment,
  })
  @ApiBadRequestResponse({
    description: 'The DTO is invalid.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  public async create(
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    return this.commentsService.create(createCommentDto);
  }

  /**
   * Finds all comments.
   *
   * @decorator `@ApiBearerAuth`
   * @decorator `@ApiOperation`
   * @decorator `@ApiOkResponse`
   * @decorator `@ApiUnauthorizedResponse`
   * @decorator `@UseGuards`
   * @decorator `@Get`
   *
   * @returns An array of all comments.
   */
  @ApiBearerAuth('jwt')
  @ApiOperation({
    description: 'Finds all comments.',
    summary: 'Finds all comments.',
  })
  @ApiOkResponse({
    description: 'Successfully found all comments.',
    type: [Comment],
  })
  @ApiUnauthorizedResponse({
    description: 'Please login before calling this endpoint.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  public async findAll(): Promise<Comment[]> {
    return this.commentsService.findAll();
  }

  /**
   * Finds a comment by its content.
   *
   * @decorator `@ApiBearerAuth`
   * @decorator `@ApiOperation`
   * @decorator `@ApiParam`
   * @decorator `@ApiOkResponse`
   * @decorator `@ApiNotFoundResponse`
   * @decorator `@UseGuards`
   * @decorator `@Get`
   *
   * @param content - The content of the comment to find.
   *
   * @returns The comment with the provided content.
   */
  @ApiBearerAuth('jwt')
  @ApiOperation({
    description: 'Finds a comment by its content.',
    summary: 'Finds a comment by its content.',
  })
  @ApiParam({
    allowEmptyValue: false,
    description: 'The content of the comment to find.',
    example: 'john.doe@gmail.com',
    name: 'content',
    required: true,
    type: String,
  })
  @ApiOkResponse({
    description: 'Successfully found the comment with the provided content.',
    type: Comment,
  })
  @ApiNotFoundResponse({
    description: 'Could not find the comment with the provided content.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('/byContent/:content')
  public async findOneByContent(
    @Param('content') content: string,
  ): Promise<Comment> {
    return this.commentsService.findOneByContent(content);
  }

  /**
   * Finds a comment by its id.
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
   * @param id - The id of the comment to find.
   *
   * @returns The comment with the provided id.
   */
  @ApiBearerAuth('jwt')
  @ApiOperation({
    description: 'Finds a comment by its id.',
    summary: 'Finds a comment by its id.',
  })
  @ApiParam({
    allowEmptyValue: false,
    description: 'The id of the comment to find.',
    example: 1,
    name: 'id',
    required: true,
    type: Number,
  })
  @ApiOkResponse({
    description: 'Successfully found the comment with the provided id.',
    type: Comment,
  })
  @ApiNotFoundResponse({
    description: 'Could not find the comment with the provided id.',
  })
  @ApiUnauthorizedResponse({
    description: 'Please login before calling this endpoint.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('/byId/:id')
  public async findOneById(@Param('id') id: string): Promise<Comment> {
    return this.commentsService.findOneById(+id);
  }

  /**
   * Updates the content and/or name of the comment with the provided id.
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
   * @param id - The id of the comment to update.
   * @param updateCommentDto - The DTO with the data to update the comment with.
   *
   * @returns The updated comment
   */
  @ApiBearerAuth('jwt')
  @ApiOperation({
    description:
      'Updates the content and/or name of the comment with the provided id.',
    summary:
      'Updates the content and/or name of the comment with the provided id.',
  })
  @ApiParam({
    allowEmptyValue: false,
    description: 'The id of the comment to update.',
    example: 1,
    name: 'id',
    required: true,
    type: Number,
  })
  @ApiBody({
    description: 'The DTO with the data to update the comment with.',
    required: true,
    type: UpdateCommentDto,
  })
  @ApiOkResponse({
    description: 'Successfully updated the comment with the provided data.',
    type: Comment,
  })
  @ApiNotFoundResponse({
    description: 'Could not find the comment with the provided id.',
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
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    return this.commentsService.update(+id, updateCommentDto);
  }

  /**
   * Removes a comment.
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
   * @param id - The id of the comment to remove.
   */
  @ApiBearerAuth('jwt')
  @ApiOperation({
    description: 'Removes a comment.',
    summary: 'Removes a comment.',
  })
  @ApiParam({
    allowEmptyValue: false,
    description: 'The id of the comment to remove.',
    example: 1,
    name: 'id',
    required: true,
    type: Number,
  })
  @ApiOkResponse({
    description: 'Successfully removed the comment with the provided id.',
    type: Comment,
  })
  @ApiNotFoundResponse({
    description: 'Could not find the comment with the provided id.',
  })
  @ApiUnauthorizedResponse({
    description: 'Please login before calling this endpoint.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<void> {
    return this.commentsService.remove(+id);
  }
}
