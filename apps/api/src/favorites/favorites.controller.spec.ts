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
import { Media } from '../medias/entities/media.entity';
import { MediasController } from '../medias/medias.controller';
import { MediasService } from '../medias/medias.service';
import { User } from '../users/entities/user.entity';
import { UsersController } from '../users/users.controller';
import { UsersService } from '../users/users.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { Favorite } from './entities/favorite.entity';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';

describe('FavoritesController', () => {
  let favoritesController: FavoritesController;
  let favoritesRepository: Repository<Favorite>;
  let mediasRepository: Repository<Media>;
  let usersRepository: Repository<User>;
  let app: NestApplication;
  let httpServer: unknown;
  let favorite: Favorite;
  let media: Media;
  let user: User;

  afterAll(async () => {
    await TestDataSource.dropDatabase();
    await TestDataSource.destroy();
  });

  beforeAll(async () => {
    favoritesRepository = TestDataSource.getRepository(Favorite);
    mediasRepository = TestDataSource.getRepository(Media);
    usersRepository = TestDataSource.getRepository(User);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoritesController, UsersController, MediasController],
      providers: [
        {
          provide: FavoritesService,
          useValue: new FavoritesService(favoritesRepository),
        },
        { provide: getRepositoryToken(Favorite), useClass: Repository },
        {
          provide: UsersService,
          useValue: new UsersService(usersRepository),
        },
        { provide: getRepositoryToken(User), useClass: Repository },
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

    favoritesController = module.get<FavoritesController>(FavoritesController);
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

    const usersResp = await request(httpServer).post('/users').send({
      email: 'john.doe@gmail.com',
      name: 'johndoe',
    });

    user = plainToInstance(User, usersResp.body);

    const mediasResp = await request(httpServer).post('/medias').send({
      title: 'Podcast 1',
      link: 'http://podcast1.com',
      type: MediaType.PODCAST_VIDEO,
      releaseDate: new Date(),
    });

    media = plainToInstance(Media, mediasResp.body);
  });

  it('should be defined', () => {
    expect(favoritesController).toBeDefined();
  });

  describe('when creating a new favorite', () => {
    it('should throw an exception if the DTO is invalid', async () => {
      const newFavoriteDto = plainToInstance(CreateFavoriteDto, {
        user: {
          id: -1,
        },
      });

      await request(httpServer)
        .post('/favorites')
        .send(newFavoriteDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should create a new favorite if the DTO is valid', async () => {
      const newFavoriteDto = plainToInstance(CreateFavoriteDto, {
        media: {
          id: media.id,
        },
        user: {
          id: user.id,
        },
      });

      const resp = await request(httpServer)
        .post('/favorites')
        .send(newFavoriteDto)
        .expect(HttpStatus.CREATED);

      const newFavorite = plainToInstance(Favorite, resp.body);

      expect(newFavorite).toHaveProperty('createdAt');

      newFavorite.user = plainToInstance(User, user);
      newFavorite.media = plainToInstance(Media, media);

      favorite = plainToInstance(Favorite, newFavorite);
    });
  });

  it('should find all favorites', async () => {
    const resp = await request(httpServer)
      .get('/favorites')
      .expect(HttpStatus.OK);

    const allFavoritesLocal = resp.body as Favorite[];

    expect(allFavoritesLocal.length).toBe(1);
    expect(allFavoritesLocal[0]).toEqual(favorite);
  });

  describe('when finding a favorite by id', () => {
    it('should throw an exception if the id cannot be found', async () => {
      await request(httpServer)
        .get('/favorites/byId/-1')
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should find a favorite if the id is found', async () => {
      const resp = await request(httpServer)
        .get('/favorites/byId/1')
        .expect(HttpStatus.OK);

      const foundFavorite = plainToInstance(Favorite, resp.body);

      expect(foundFavorite).toEqual(favorite);
    });
  });

  describe('when removing a favorite', () => {
    it('should throw and exception if the favorite does not exist', async () => {
      await request(httpServer)
        .delete('/favorites/-1')
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should remove a favorite if it exists', async () => {
      await request(httpServer).delete('/favorites/1').expect(HttpStatus.OK);

      const resp = await request(httpServer)
        .get('/favorites')
        .expect(HttpStatus.OK);

      const allFavoritesLocal = resp.body as Favorite[];

      expect(allFavoritesLocal.length).toBe(0);
    });
  });
});
