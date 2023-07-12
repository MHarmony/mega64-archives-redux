import { MediaType } from '@mega64/common';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import request from 'supertest';
import { Repository } from 'typeorm';
import TestDataSource from '../../tests/test.datasource';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { Media } from './entities/media.entity';
import { MediasController } from './medias.controller';
import { MediasService } from './medias.service';

describe('MediasController', () => {
  let mediasController: MediasController;
  let mediasRepository: Repository<Media>;
  let app: NestApplication;
  let httpServer: unknown;
  let media: Media;

  afterAll(async () => {
    await TestDataSource.dropDatabase();
    await TestDataSource.destroy();
  });

  beforeAll(async () => {
    mediasRepository = TestDataSource.getRepository(Media);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MediasController],
      providers: [
        {
          provide: MediasService,
          useValue: new MediasService(mediasRepository),
        },
        { provide: getRepositoryToken(Media), useClass: Repository },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue(true)
      .compile();

    mediasController = module.get<MediasController>(MediasController);
    app = module.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        disableErrorMessages: process.env.NODE_ENV === 'production',
        forbidNonWhitelisted: true,
        transform: true,
        whitelist: true,
      }),
    );

    await app.init();
    await TestDataSource.initialize();

    httpServer = app.getHttpServer();
  });

  it('should be defined', () => {
    expect(mediasController).toBeDefined();
  });

  describe('when creating a new media', () => {
    it('should throw an exception if the DTO is invalid', async () => {
      const newMediaDto = plainToInstance(CreateMediaDto, {
        user: {
          id: -1,
        },
      });

      await request(httpServer)
        .post('/medias')
        .send(newMediaDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should create a new media if the DTO is valid', async () => {
      const newMediaDto = plainToInstance(CreateMediaDto, {
        title: 'Podcast 1',
        link: 'http://podcast1.com',
        type: MediaType.PODCAST_VIDEO,
        releaseDate: new Date(),
      });

      const resp = await request(httpServer)
        .post('/medias')
        .send(newMediaDto)
        .expect(HttpStatus.CREATED);

      const newMedia = plainToInstance(Media, resp.body);

      expect(newMedia).toHaveProperty('createdAt');

      media = plainToInstance(Media, newMedia);
    });
  });

  it('should find all medias', async () => {
    const resp = await request(httpServer).get('/medias').expect(HttpStatus.OK);

    const allMediasLocal = resp.body as Media[];

    expect(allMediasLocal.length).toBe(1);
    expect(allMediasLocal[0]).toEqual(media);
  });

  describe('when finding a media by id', () => {
    it('should throw an exception if the id cannot be found', async () => {
      await request(httpServer)
        .get('/medias/byId/-1')
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should find a media if the id is found', async () => {
      const resp = await request(httpServer)
        .get('/medias/byId/1')
        .expect(HttpStatus.OK);

      const foundMedia = plainToInstance(Media, resp.body);

      expect(foundMedia).toEqual(media);
    });
  });

  describe('when finding a media by title', () => {
    it('should throw an exception if the title cannot be found', async () => {
      await request(httpServer)
        .get('/medias/byTitle/reee')
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should find a media if the title is found', async () => {
      const resp = await request(httpServer)
        .get(encodeURI('/medias/byTitle/Podcast 1'))
        .expect(HttpStatus.OK);

      const foundMedia = plainToInstance(Media, resp.body);

      expect(foundMedia).toEqual(media);
    });
  });

  describe('when updating a media', () => {
    it('should throw an exception if the media does not exist', async () => {
      const updateMediaDto = plainToInstance(UpdateMediaDto, {
        title: 'reee',
      });

      await request(httpServer)
        .put('/medias/-1')
        .send(updateMediaDto)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should throw an exception if the media exists and the DTO is invalid', async () => {
      const updateMediaDto = plainToInstance(UpdateMediaDto, {
        title: '',
      });

      await request(httpServer)
        .patch('/medias/1')
        .send(updateMediaDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should update a media if it exists and the DTO is valid', async () => {
      const updateMediaDto = plainToInstance(UpdateMediaDto, {
        title: 'reee',
      });

      const resp = await request(httpServer)
        .patch('/medias/1')
        .send(updateMediaDto)
        .expect(HttpStatus.OK);

      const updatedMedia = plainToInstance(Media, resp.body);

      expect(updatedMedia).not.toEqual(media);
    });
  });
});
