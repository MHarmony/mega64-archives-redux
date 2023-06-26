import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';

/**
 * The service for interacting with {@link Tag} entities.
 *
 * @decorator `@Injectable`
 */
@Injectable()
export class TagsService {
  /**
   * The constructor for TagsService.
   *
   * @param tagsRepository - The TagsRepository.
   */
  public constructor(
    @InjectRepository(Tag) private readonly tagsRepository: Repository<Tag>
  ) {}

  /**
   * Creates a new tag.
   *
   * @param createTagDto - The DTO with the data to create the tag with.
   *
   * @returns The newly created tag.
   */
  public async create(createTagDto: CreateTagDto): Promise<Tag> {
    return this.tagsRepository.save(createTagDto);
  }

  /**
   * Finds all tags.
   *
   * @returns An array of all tags.
   */
  public async findAll(): Promise<Tag[]> {
    return this.tagsRepository.find({ order: { updatedAt: 'DESC' } });
  }

  /**
   * Finds a tag by its content.
   *
   * @param content - The content of the tag to find.
   *
   * @returns The tag with the provided content.
   *
   * @throws `NotFoundException`
   * This exception is thrown if the tag with the provided content does not exist.
   */
  public async findOneByContent(content: string): Promise<Tag> {
    const foundTag = await this.tagsRepository.findOneBy({ content });

    if (!foundTag) {
      throw new NotFoundException(
        `The tag with content ${content} was not found.`
      );
    }

    return foundTag;
  }

  /**
   * Finds a tag by its id.
   *
   * @param id - The id of the tag to find.
   *
   * @returns The tag with the provided id.
   *
   * @throws `NotFoundException`
   * This exception is thrown if the tag with the provided id does not exist.
   */
  public async findOneById(id: number): Promise<Tag> {
    const foundTag = await this.tagsRepository.findOneBy({ id });

    if (!foundTag) {
      throw new NotFoundException(`The tag with id ${id} was not found.`);
    }

    return foundTag;
  }

  /**
   * Updates the content of a tag with the provided id.
   *
   * @param id - The id of the tag to update.
   * @param updateTagDto - The DTO with the data to update the tag with.
   *
   * @returns The updated tag
   */
  public async update(id: number, updateTagDto: UpdateTagDto): Promise<Tag> {
    const foundTag = await this.findOneById(id);

    foundTag.content = updateTagDto.content;

    return this.tagsRepository.save(foundTag);
  }

  /**
   * Removes a tag.
   *
   * @param id - The id of the tag to remove.
   */
  public async remove(id: number): Promise<void> {
    const foundTag = await this.findOneById(id);

    await this.tagsRepository.remove(foundTag);
  }
}
