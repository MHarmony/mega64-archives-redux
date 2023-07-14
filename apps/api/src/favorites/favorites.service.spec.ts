import { MediaType } from '@mega64/common';
import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer/types';
import { Repository } from 'typeorm';
import TestDataSource from '../../tests/test.datasource';
import { Media } from '../medias/entities/media.entity';
import { MediasService } from '../medias/medias.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { Favorite } from './entities/favorite.entity';
import { FavoritesService } from './favorites.service';

describe('FavoritesService', () => {
  let favoritesService: FavoritesService;
  let usersService: UsersService;
  let mediasService: MediasService;
  let favoritesRepository: Repository<Favorite>;
  let usersRepository: Repository<User>;
  let mediasRepository: Repository<Media>;
  const allFavorites: Favorite[] = [];
  let favorite: Favorite;
  let user: User;
  let media: Media;

  afterAll(async () => {
    await TestDataSource.dropDatabase();
    await TestDataSource.destroy();
  });

  beforeAll(async () => {
    await Test.createTestingModule({
      providers: [
        FavoritesService,
        { provide: getRepositoryToken(Favorite), useClass: Repository },
        UsersService,
        { provide: getRepositoryToken(User), useClass: Repository },
      ],
    }).compile();

    favoritesRepository = TestDataSource.getRepository(Favorite);
    favoritesService = new FavoritesService(favoritesRepository);
    mediasRepository = TestDataSource.getRepository(Media);
    mediasService = new MediasService(mediasRepository);
    usersRepository = TestDataSource.getRepository(User);
    usersService = new UsersService(usersRepository);

    await TestDataSource.initialize();

    user = await usersService.create({
      email: 'john.doe@gmail.com',
      name: 'johndoe',
    });

    user = plainToInstance(User, user);

    media = await mediasService.create({
      title: 'Podcast 1',
      link: 'http://podcast1.com',
      type: MediaType.PODCAST_VIDEO,
      releaseDate: new Date(),
    });

    media = plainToInstance(Media, media);
  });

  it('should be defined', () => {
    expect(favoritesRepository).toBeDefined();
    expect(favoritesService).toBeDefined();
  });

  it('should create a new favorite', async () => {
    const newFavoriteDto = plainToInstance(CreateFavoriteDto, {
      media: {
        id: media.id,
      },
      user: {
        id: user.id,
      },
    });

    const newFavorite = await favoritesService.create(newFavoriteDto);

    expect(newFavorite).toHaveProperty('createdAt');

    newFavorite.user = plainToInstance(User, user);
    newFavorite.media = plainToInstance(Media, media);

    favorite = plainToInstance(Favorite, newFavorite);
    allFavorites.push(favorite);
  });

  it('should find all favorites', async () => {
    const allFavoritesLocal = await favoritesService.findAll();

    expect(allFavoritesLocal.length).toBe(1);
    expect(allFavoritesLocal[0]).toEqual(favorite);
  });

  describe('when finding a favorite by id', () => {
    it('should throw an exception if the id cannot be found', async () => {
      expect(favoritesService.findOneById(-1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should find a favorite if the id is found', async () => {
      const foundFavorite = await favoritesService.findOneById(1);

      expect(foundFavorite).toEqual(favorite);
    });
  });

  describe('when removing a favorite', () => {
    it('should throw and exception if the favorite does not exist', async () => {
      expect(favoritesService.remove(-1)).rejects.toThrow(NotFoundException);
    });

    it('should remove a favorite if it exists', async () => {
      await favoritesService.remove(1);

      const allFavoritesLocal = await favoritesService.findAll();

      expect(allFavoritesLocal.length).toBe(0);
    });
  });
});
