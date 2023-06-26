import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

/**
 * The service for interacting with {@link Comment} entities.
 *
 * @decorator `@Injectable`
 */
@Injectable()
export class CommentsService {
  /**
   * The constructor for CommentsService.
   *
   * @param commentsRepository - The CommentsRepository.
   */
  public constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>
  ) {}

  /**
   * Creates a new comment.
   *
   * @param createCommentDto - The DTO with the data to create the comment with.
   *
   * @returns The newly created comment.
   */
  public async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.commentsRepository.save(createCommentDto);
  }

  /**
   * Finds all comments.
   *
   * @returns An array of all comments.
   */
  public async findAll(): Promise<Comment[]> {
    return this.commentsRepository.find({ order: { updatedAt: 'DESC' } });
  }

  /**
   * Finds a comment by its content.
   *
   * @param content - The content of the comment to find.
   *
   * @returns The comment with the provided content.
   *
   * @throws `NotFoundException`
   * This exception is thrown if the comment with the provided content does not exist.
   */
  public async findOneByContent(content: string): Promise<Comment> {
    const foundComment = await this.commentsRepository.findOneBy({ content });

    if (!foundComment) {
      throw new NotFoundException(
        `The comment with content ${content} was not found.`
      );
    }

    return foundComment;
  }

  /**
   * Finds a comment by its id.
   *
   * @param id - The id of the comment to find.
   *
   * @returns The comment with the provided id.
   *
   * @throws `NotFoundException`
   * This exception is thrown if the comment with the provided id does not exist.
   */
  public async findOneById(id: number): Promise<Comment> {
    const foundComment = await this.commentsRepository.findOneBy({ id });

    if (!foundComment) {
      throw new NotFoundException(`The comment with id ${id} was not found.`);
    }

    return foundComment;
  }

  /**
   * Updates the content of a comment with the provided id.
   *
   * @param id - The id of the comment to update.
   * @param updateCommentDto - The DTO with the data to update the comment with.
   *
   * @returns The updated comment
   */
  public async update(
    id: number,
    updateCommentDto: UpdateCommentDto
  ): Promise<Comment> {
    const foundComment = await this.findOneById(id);

    foundComment.content = updateCommentDto.content;

    return this.commentsRepository.save(foundComment);
  }

  /**
   * Removes a comment.
   *
   * @param id - The id of the comment to remove.
   */
  public async remove(id: number): Promise<void> {
    const foundComment = await this.findOneById(id);

    await this.commentsRepository.remove(foundComment);
  }
}
