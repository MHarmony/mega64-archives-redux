import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { Media } from './entities/media.entity';

/**
 * The service for interacting with {@link Media} entities.
 *
 * @decorator `@Injectable`
 */
@Injectable()
export class MediasService {
  /**
   * The constructor for MediasService.
   *
   * @param mediasRepository - The MediasRepository.
   */
  public constructor(
    @InjectRepository(Media)
    private readonly mediasRepository: Repository<Media>,
  ) {}

  /**
   * Creates a new media.
   *
   * @param createMediaDto - The DTO with the data to create the media with.
   *
   * @returns The newly created media.
   */
  public async create(createMediaDto: CreateMediaDto): Promise<Media> {
    return this.mediasRepository.save(createMediaDto);
  }

  /**
   * Finds all medias.
   *
   * @returns An array of all medias.
   */
  public async findAll(): Promise<Media[]> {
    return this.mediasRepository.find({ order: { updatedAt: 'DESC' } });
  }

  /**
   * Finds a media by its title.
   *
   * @param title - The title of the media to find.
   *
   * @returns The media with the provided title.
   *
   * @throws `NotFoundException`
   * This exception is thrown if the media with the provided title does not exist.
   */
  public async findOneByTitle(title: string): Promise<Media> {
    const foundMedia = await this.mediasRepository.findOneBy({ title });

    if (!foundMedia) {
      throw new NotFoundException(
        `The media with title ${title} was not found.`,
      );
    }

    return foundMedia;
  }

  /**
   * Finds a media by its id.
   *
   * @param id - The id of the media to find.
   *
   * @returns The media with the provided id.
   *
   * @throws `NotFoundException`
   * This exception is thrown if the media with the provided id does not exist.
   */
  public async findOneById(id: number): Promise<Media> {
    const foundMedia = await this.mediasRepository.findOneBy({ id });

    if (!foundMedia) {
      throw new NotFoundException(`The media with id ${id} was not found.`);
    }

    return foundMedia;
  }

  /**
   * Updates the title, description, or link of a media with the provided id.
   *
   * @param id - The id of the media to update.
   * @param updateMediaDto - The DTO with the data to update the media with.
   *
   * @returns The updated media
   */
  public async update(
    id: number,
    updateMediaDto: UpdateMediaDto,
  ): Promise<Media> {
    const foundMedia = await this.findOneById(id);

    if (updateMediaDto.description) {
      foundMedia.description = updateMediaDto.description;
    }

    if (updateMediaDto.link) {
      foundMedia.link = updateMediaDto.link;
    }

    if (updateMediaDto.title) {
      foundMedia.title = updateMediaDto.title;
    }

    return this.mediasRepository.save(foundMedia);
  }
}
