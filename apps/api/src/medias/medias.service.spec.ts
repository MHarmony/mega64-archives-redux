import { MediaType } from '@mega64/common';
import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer/types';
import { Repository } from 'typeorm';
import TestDataSource from '../../tests/test.datasource';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { Media } from './entities/media.entity';
import { MediasService } from './medias.service';

describe('MediasService', () => {
  let mediasService: MediasService;
  let mediasRepository: Repository<Media>;
  const allMedias: Media[] = [];
  let media: Media;

  afterAll(async () => {
    await TestDataSource.dropDatabase();
    await TestDataSource.destroy();
  });

  beforeAll(async () => {
    await Test.createTestingModule({
      providers: [
        MediasService,
        { provide: getRepositoryToken(Media), useClass: Repository },
      ],
    }).compile();

    mediasRepository = TestDataSource.getRepository(Media);
    mediasService = new MediasService(mediasRepository);

    await TestDataSource.initialize();
  });

  it('should be defined', () => {
    expect(mediasRepository).toBeDefined();
    expect(mediasService).toBeDefined();
  });

  it('should create a new media', async () => {
    const newMediaDto = plainToInstance(CreateMediaDto, {
      title: 'Podcast 1',
      link: 'http://podcast1.com',
      type: MediaType.PODCAST_VIDEO,
      releaseDate: new Date(),
    });

    const newMedia = await mediasService.create(newMediaDto);

    expect(newMedia).toHaveProperty('createdAt');

    media = plainToInstance(Media, newMedia);
    allMedias.push(media);
  });

  it('should find all medias', async () => {
    const allMediasLocal = await mediasService.findAll();

    expect(allMediasLocal.length).toBe(1);
    expect(allMediasLocal[0]).toEqual(media);
  });

  describe('when finding a media by id', () => {
    it('should throw an exception if the id cannot be found', async () => {
      expect(mediasService.findOneById(-1)).rejects.toThrow(NotFoundException);
    });

    it('should find a media if the id is found', async () => {
      const foundMedia = await mediasService.findOneById(1);

      expect(foundMedia).toEqual(media);
    });
  });

  describe('when finding a media by title', () => {
    it('should throw an exception if the title cannot be found', async () => {
      expect(mediasService.findOneByTitle('reeee')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should find a media if the title is found', async () => {
      const foundMedia = await mediasService.findOneByTitle('Podcast 1');

      expect(foundMedia).toEqual(media);
    });
  });

  describe('when updating a media', () => {
    it('should throw an exception if the media does not exist', async () => {
      const updateMediaDto = plainToInstance(UpdateMediaDto, {
        description: 'breh',
        link: 'https://thevideo.com',
        title: 'reee',
      });

      expect(mediasService.update(-1, updateMediaDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update a media if it exists', async () => {
      const updateMediaDto = plainToInstance(CreateMediaDto, {
        description: 'breh',
        link: 'https://thevideo.com',
        title: 'reee',
      });

      const updatedMedia = await mediasService.update(1, updateMediaDto);

      expect(updatedMedia).not.toEqual(media);
    });
  });
});
