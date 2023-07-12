import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { Reply } from './entities/reply.entity';

/**
 * The service for interacting with {@link Reply} entities.
 *
 * @decorator `@Injectable`
 */
@Injectable()
export class RepliesService {
  /**
   * The constructor for RepliesService.
   *
   * @param repliesRepository - The RepliesRepository.
   */
  public constructor(
    @InjectRepository(Reply)
    private readonly repliesRepository: Repository<Reply>,
  ) {}

  /**
   * Creates a new reply.
   *
   * @param createReplyDto - The DTO with the data to create the reply with.
   *
   * @returns The newly created reply.
   */
  public async create(createReplyDto: CreateReplyDto): Promise<Reply> {
    return this.repliesRepository.save(createReplyDto);
  }

  /**
   * Finds all replies.
   *
   * @returns An array of all replies.
   */
  public async findAll(): Promise<Reply[]> {
    return this.repliesRepository.find({
      relations: ['parentComment'],
      order: { updatedAt: 'DESC' },
    });
  }

  /**
   * Finds a reply by its content.
   *
   * @param content - The content of the reply to find.
   *
   * @returns The reply with the provided content.
   *
   * @throws `NotFoundException`
   * This exception is thrown if the reply with the provided content does not exist.
   */
  public async findOneByContent(content: string): Promise<Reply> {
    const foundReply = await this.repliesRepository.findOne({
      relations: ['parentComment'],
      where: { content },
    });

    if (!foundReply) {
      throw new NotFoundException(
        `The reply with content ${content} was not found.`,
      );
    }

    return foundReply;
  }

  /**
   * Finds a reply by its id.
   *
   * @param id - The id of the reply to find.
   *
   * @returns The reply with the provided id.
   *
   * @throws `NotFoundException`
   * This exception is thrown if the reply with the provided id does not exist.
   */
  public async findOneById(id: number): Promise<Reply> {
    const foundReply = await this.repliesRepository.findOne({
      relations: ['parentComment'],
      where: { id },
    });

    if (!foundReply) {
      throw new NotFoundException(`The reply with id ${id} was not found.`);
    }

    return foundReply;
  }

  /**
   * Updates the content of a reply with the provided id.
   *
   * @param id - The id of the reply to update.
   * @param updateReplyDto - The DTO with the data to update the reply with.
   *
   * @returns The updated reply
   */
  public async update(
    id: number,
    updateReplyDto: UpdateReplyDto,
  ): Promise<Reply> {
    const foundReply = await this.findOneById(id);

    foundReply.content = updateReplyDto.content;

    return this.repliesRepository.save(foundReply);
  }

  /**
   * Removes a reply.
   *
   * @param id - The id of the reply to remove.
   */
  public async remove(id: number): Promise<void> {
    const foundReply = await this.findOneById(id);

    await this.repliesRepository.remove(foundReply);
  }
}
