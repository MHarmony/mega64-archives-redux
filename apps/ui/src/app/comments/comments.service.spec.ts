import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  Comment,
  CreateComment,
  UpdateComment,
  UserType,
} from '@mega64/common';
import { plainToInstance } from 'class-transformer/types';
import { v4 as uuidv4 } from 'uuid';
import { CommentsService } from './comments.service';

describe('CommentsService', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let mockComment: Comment;
  const mockComments: Comment[] = [];
  let commentsService: CommentsService;

  afterEach(() => {
    httpTestingController.verify();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    mockComment = {
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
      replies: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockComments.push(mockComment);
    commentsService = TestBed.inject(CommentsService);
  });

  it('should be created', () => {
    expect(commentsService).toBeTruthy();
  });

  it('should create a new comment', async () => {
    const newCommentDto = plainToInstance(CreateComment, {
      content: 'bruh',
      user: {
        id: 1,
      },
    });

    commentsService
      .create(newCommentDto)
      .then((comment) => expect(comment).toEqual(mockComment));

    const req = httpTestingController.expectOne('/api/comments');

    expect(req.request.method).toEqual('POST');

    req.flush(mockComment);
  });

  it('should find all comments', async () => {
    commentsService
      .findAll()
      .then((comments) => expect(comments).toEqual(mockComments));

    const req = httpTestingController.expectOne('/api/comments');

    expect(req.request.method).toEqual('GET');

    req.flush(mockComments);
  });

  it('should find a comment by id', async () => {
    commentsService
      .findOneById(1)
      .then((comment) => expect(comment).toEqual(mockComment));

    const req = httpTestingController.expectOne('/api/comments/byId/1');

    expect(req.request.method).toEqual('GET');

    req.flush(mockComment);
  });

  it('should find a comment by content', async () => {
    commentsService
      .findOneByContent('bruh')
      .then((comment) => expect(comment).toEqual(mockComment));

    const req = httpTestingController.expectOne('/api/comments/byContent/bruh');

    expect(req.request.method).toEqual('GET');

    req.flush(mockComment);
  });

  it('should update a comment', async () => {
    const updateCommentDto = plainToInstance(UpdateComment, {
      content: 'reee',
    });

    commentsService
      .update(1, updateCommentDto)
      .then((comment) => expect(comment).toEqual(mockComment));

    const req = httpTestingController.expectOne('/api/comments/1');

    expect(req.request.method).toEqual('PATCH');

    req.flush(mockComment);
  });

  it('should delete a comment', async () => {
    commentsService.remove(1).then((x) => expect(x).toBeNull());

    const req = httpTestingController.expectOne('/api/comments/1');

    expect(req.request.method).toEqual('DELETE');

    req.flush(null);
  });
});
