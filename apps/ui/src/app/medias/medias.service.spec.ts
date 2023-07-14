import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Media, MediaType, UpdateMedia } from '@mega64/common';
import { plainToInstance } from 'class-transformer/types';
import { v4 as uuidv4 } from 'uuid';
import { MediasService } from './medias.service';

describe('MediasService', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let mockMedia: Media;
  const mockMedias: Media[] = [];
  let mediasService: MediasService;

  afterEach(() => {
    httpTestingController.verify();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    mockMedia = {
      id: 1,
      guid: uuidv4(),
      title: 'Podcast 120',
      description: 'Podcast 120',
      link: 'https://linktovideo.com',
      type: MediaType.PODCAST_VIDEO,
      releaseDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockMedias.push(mockMedia);
    mediasService = TestBed.inject(MediasService);
  });

  it('should be created', () => {
    expect(mediasService).toBeTruthy();
  });

  it('should find all medias', async () => {
    mediasService
      .findAll()
      .then((medias) => expect(medias).toEqual(mockMedias));

    const req = httpTestingController.expectOne('/api/medias');

    expect(req.request.method).toEqual('GET');

    req.flush(mockMedias);
  });

  it('should find a media by id', async () => {
    mediasService
      .findOneById(1)
      .then((media) => expect(media).toEqual(mockMedia));

    const req = httpTestingController.expectOne('/api/medias/byId/1');

    expect(req.request.method).toEqual('GET');

    req.flush(mockMedia);
  });

  it('should find a media by title', async () => {
    mediasService
      .findOneByTitle('bruh')
      .then((media) => expect(media).toEqual(mockMedia));

    const req = httpTestingController.expectOne('/api/medias/byTitle/bruh');

    expect(req.request.method).toEqual('GET');

    req.flush(mockMedia);
  });

  it('should update a media', async () => {
    const updateMediaDto = plainToInstance(UpdateMedia, {
      title: 'reee',
    });

    mediasService
      .update(1, updateMediaDto)
      .then((media) => expect(media).toEqual(mockMedia));

    const req = httpTestingController.expectOne('/api/medias/1');

    expect(req.request.method).toEqual('PATCH');

    req.flush(mockMedia);
  });

  it('should delete a media', async () => {
    mediasService.remove(1).then((x) => expect(x).toBeNull());

    const req = httpTestingController.expectOne('/api/medias/1');

    expect(req.request.method).toEqual('DELETE');

    req.flush(null);
  });
});
