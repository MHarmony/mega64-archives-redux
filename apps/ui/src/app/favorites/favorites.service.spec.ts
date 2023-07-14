import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CreateFavorite, Favorite, MediaType, UserType } from '@mega64/common';
import { plainToInstance } from 'class-transformer/types';
import { v4 as uuidv4 } from 'uuid';
import { FavoritesService } from './favorites.service';

describe('FavoritesService', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let mockFavorite: Favorite;
  const mockFavorites: Favorite[] = [];
  let favoritesService: FavoritesService;

  afterEach(() => {
    httpTestingController.verify();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    mockFavorite = {
      id: 1,
      guid: uuidv4(),
      media: {
        id: 1,
        guid: uuidv4(),
        title: 'Podcast 120',
        description: 'Podcast 120',
        link: 'https://linktovideo.com',
        type: MediaType.PODCAST_VIDEO,
        releaseDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      user: {
        id: 1,
        email: 'john.doe.@gmail.com',
        guid: uuidv4(),
        name: 'johndoe',
        type: UserType.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockFavorites.push(mockFavorite);
    favoritesService = TestBed.inject(FavoritesService);
  });

  it('should be created', () => {
    expect(favoritesService).toBeTruthy();
  });

  it('should create a new favorite', async () => {
    const newFavoriteDto = plainToInstance(CreateFavorite, {
      media: {
        id: 1,
      },
      user: {
        id: 1,
      },
    });

    favoritesService
      .create(newFavoriteDto)
      .then((favorite) => expect(favorite).toEqual(mockFavorite));

    const req = httpTestingController.expectOne('/api/favorites');

    expect(req.request.method).toEqual('POST');

    req.flush(mockFavorite);
  });

  it('should find all favorites', async () => {
    favoritesService
      .findAll()
      .then((favorites) => expect(favorites).toEqual(mockFavorites));

    const req = httpTestingController.expectOne('/api/favorites');

    expect(req.request.method).toEqual('GET');

    req.flush(mockFavorites);
  });

  it('should find a favorite by id', async () => {
    favoritesService
      .findOneById(1)
      .then((favorite) => expect(favorite).toEqual(mockFavorite));

    const req = httpTestingController.expectOne('/api/favorites/byId/1');

    expect(req.request.method).toEqual('GET');

    req.flush(mockFavorite);
  });

  it('should delete a favorite', async () => {
    favoritesService.remove(1).then((x) => expect(x).toBeNull());

    const req = httpTestingController.expectOne('/api/favorites/1');

    expect(req.request.method).toEqual('DELETE');

    req.flush(null);
  });
});
