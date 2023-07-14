import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CreateReply, Reply, UpdateReply, UserType } from '@mega64/common';
import { plainToInstance } from 'class-transformer/types';
import { v4 as uuidv4 } from 'uuid';
import { RepliesService } from './replies.service';

describe('ReplysService', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let mockReply: Reply;
  const mockReplies: Reply[] = [];
  let repliesService: RepliesService;

  afterEach(() => {
    httpTestingController.verify();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    mockReply = {
      id: 1,
      guid: uuidv4(),
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
      parentComment: {
        id: 1,
        content: 'bruh',
        guid: uuidv4(),
        replies: [],
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
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockReplies.push(mockReply);
    repliesService = TestBed.inject(RepliesService);
  });

  it('should be created', () => {
    expect(repliesService).toBeTruthy();
  });

  it('should create a new reply', async () => {
    const newReplyDto = plainToInstance(CreateReply, {
      content: 'bruh',
      user: {
        id: 1,
      },
      parentComment: {
        id: 1,
      },
    });

    repliesService
      .create(newReplyDto)
      .then((reply) => expect(reply).toEqual(mockReply));

    const req = httpTestingController.expectOne('/api/replies');

    expect(req.request.method).toEqual('POST');

    req.flush(mockReply);
  });

  it('should find all replies', async () => {
    repliesService
      .findAll()
      .then((replies) => expect(replies).toEqual(mockReplies));

    const req = httpTestingController.expectOne('/api/replies');

    expect(req.request.method).toEqual('GET');

    req.flush(mockReplies);
  });

  it('should find a reply by id', async () => {
    repliesService
      .findOneById(1)
      .then((reply) => expect(reply).toEqual(mockReply));

    const req = httpTestingController.expectOne('/api/replies/byId/1');

    expect(req.request.method).toEqual('GET');

    req.flush(mockReply);
  });

  it('should find a reply by content', async () => {
    repliesService
      .findOneByContent('bruh')
      .then((reply) => expect(reply).toEqual(mockReply));

    const req = httpTestingController.expectOne('/api/replies/byContent/bruh');

    expect(req.request.method).toEqual('GET');

    req.flush(mockReply);
  });

  it('should update a reply', async () => {
    const updateReplyDto = plainToInstance(UpdateReply, {
      content: 'reee',
    });

    repliesService
      .update(1, updateReplyDto)
      .then((reply) => expect(reply).toEqual(mockReply));

    const req = httpTestingController.expectOne('/api/replies/1');

    expect(req.request.method).toEqual('PATCH');

    req.flush(mockReply);
  });

  it('should delete a reply', async () => {
    repliesService.remove(1).then((x) => expect(x).toBeNull());

    const req = httpTestingController.expectOne('/api/replies/1');

    expect(req.request.method).toEqual('DELETE');

    req.flush(null);
  });
});
