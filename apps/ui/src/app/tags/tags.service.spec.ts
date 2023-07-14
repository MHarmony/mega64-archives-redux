import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CreateTag, Tag, UpdateTag, UserType } from '@mega64/common';
import { plainToInstance } from 'class-transformer/types';
import { v4 as uuidv4 } from 'uuid';
import { TagsService } from './tags.service';

describe('TagsService', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let mockTag: Tag;
  const mockTags: Tag[] = [];
  let tagsService: TagsService;

  afterEach(() => {
    httpTestingController.verify();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    mockTag = {
      id: 1,
      guid: uuidv4(),
      itemGuid: uuidv4(),
      content: 'john.doe@gmail.com',
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

    mockTags.push(mockTag);
    tagsService = TestBed.inject(TagsService);
  });

  it('should be created', () => {
    expect(tagsService).toBeTruthy();
  });

  it('should create a new tag', async () => {
    const newTagDto = plainToInstance(CreateTag, {
      content: 'bruh',
      itemGuid: uuidv4(),
      user: {
        id: 1,
      },
    });

    tagsService.create(newTagDto).then((tag) => expect(tag).toEqual(mockTag));

    const req = httpTestingController.expectOne('/api/tags');

    expect(req.request.method).toEqual('POST');

    req.flush(mockTag);
  });

  it('should find all tags', async () => {
    tagsService.findAll().then((tags) => expect(tags).toEqual(mockTags));

    const req = httpTestingController.expectOne('/api/tags');

    expect(req.request.method).toEqual('GET');

    req.flush(mockTags);
  });

  it('should find a tag by id', async () => {
    tagsService.findOneById(1).then((tag) => expect(tag).toEqual(mockTag));

    const req = httpTestingController.expectOne('/api/tags/byId/1');

    expect(req.request.method).toEqual('GET');

    req.flush(mockTag);
  });

  it('should find a tag by content', async () => {
    tagsService
      .findOneByContent('bruh')
      .then((tag) => expect(tag).toEqual(mockTag));

    const req = httpTestingController.expectOne('/api/tags/byContent/bruh');

    expect(req.request.method).toEqual('GET');

    req.flush(mockTag);
  });

  it('should update a tag', async () => {
    const updateTagDto = plainToInstance(UpdateTag, {
      content: 'reee',
    });

    tagsService
      .update(1, updateTagDto)
      .then((tag) => expect(tag).toEqual(mockTag));

    const req = httpTestingController.expectOne('/api/tags/1');

    expect(req.request.method).toEqual('PATCH');

    req.flush(mockTag);
  });

  it('should delete a tag', async () => {
    tagsService.remove(1).then((x) => expect(x).toBeNull());

    const req = httpTestingController.expectOne('/api/tags/1');

    expect(req.request.method).toEqual('DELETE');

    req.flush(null);
  });
});
