import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import request from 'supertest';
import { Repository } from 'typeorm';
import TestDataSource from '../../tests/test.datasource';
import { User } from '../users/entities/user.entity';
import { UsersController } from '../users/users.controller';
import { UsersService } from '../users/users.service';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

describe('CommentsController', () => {
  let commentsController: CommentsController;
  let commentsRepository: Repository<Comment>;
  let usersRepository: Repository<User>;
  let app: NestApplication;
  let httpServer: unknown;
  let comment: Comment;
  let user: User;

  afterAll(async () => {
    await TestDataSource.dropDatabase();
    await TestDataSource.destroy();
  });

  beforeAll(async () => {
    commentsRepository = TestDataSource.getRepository(Comment);
    usersRepository = TestDataSource.getRepository(User);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController, UsersController],
      providers: [
        {
          provide: CommentsService,
          useValue: new CommentsService(commentsRepository),
        },
        { provide: getRepositoryToken(Comment), useClass: Repository },
        {
          provide: UsersService,
          useValue: new UsersService(usersRepository),
        },
        { provide: getRepositoryToken(User), useClass: Repository },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue(true)
      .compile();

    commentsController = module.get<CommentsController>(CommentsController);
    app = module.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        disableErrorMessages: process.env.NODE_ENV === 'production',
        forbidNonWhitelisted: true,
        transform: true,
        whitelist: true,
      })
    );

    await app.init();
    await TestDataSource.initialize();

    httpServer = app.getHttpServer();

    const resp = await request(httpServer).post('/users').send({
      email: 'john.doe@gmail.com',
      name: 'johndoe',
    });

    user = plainToInstance(User, resp.body);
  });

  it('should be defined', () => {
    expect(commentsController).toBeDefined();
  });

  describe('when creating a new comment', () => {
    it('should throw an exception if the DTO is invalid', async () => {
      const newCommentDto = plainToInstance(CreateCommentDto, {
        user: {
          id: -1,
        },
      });

      await request(httpServer)
        .post('/comments')
        .send(newCommentDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should create a new comment if the DTO is valid', async () => {
      const newCommentDto = plainToInstance(CreateCommentDto, {
        content: 'bruh',
        user: {
          id: user.id,
        },
      });

      const resp = await request(httpServer)
        .post('/comments')
        .send(newCommentDto)
        .expect(HttpStatus.CREATED);

      const newComment = plainToInstance(Comment, resp.body);

      expect(newComment).toHaveProperty('createdAt');

      newComment.user = plainToInstance(User, user);

      comment = plainToInstance(Comment, newComment);
    });
  });

  it('should find all comments', async () => {
    const resp = await request(httpServer)
      .get('/comments')
      .expect(HttpStatus.OK);

    const allCommentsLocal = resp.body as Comment[];

    expect(allCommentsLocal.length).toBe(1);
    expect(allCommentsLocal[0]).toEqual(comment);
  });

  describe('when finding a comment by id', () => {
    it('should throw an exception if the id cannot be found', async () => {
      await request(httpServer)
        .get('/comments/byId/-1')
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should find a comment if the id is found', async () => {
      const resp = await request(httpServer)
        .get('/comments/byId/1')
        .expect(HttpStatus.OK);

      const foundComment = plainToInstance(Comment, resp.body);

      expect(foundComment).toEqual(comment);
    });
  });

  describe('when finding a comment by content', () => {
    it('should throw an exception if the content cannot be found', async () => {
      await request(httpServer)
        .get('/comments/byContent/reee')
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should find a comment if the content is found', async () => {
      const resp = await request(httpServer)
        .get('/comments/byContent/bruh')
        .expect(HttpStatus.OK);

      const foundComment = plainToInstance(Comment, resp.body);

      expect(foundComment).toEqual(comment);
    });
  });

  describe('when updating a comment', () => {
    it('should throw an exception if the comment does not exist', async () => {
      const updateCommentDto = plainToInstance(UpdateCommentDto, {
        content: 'reee',
      });

      await request(httpServer)
        .put('/comments/-1')
        .send(updateCommentDto)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should throw an exception if the comment exists and the DTO is invalid', async () => {
      const updateCommentDto = plainToInstance(UpdateCommentDto, {
        content: '',
      });

      await request(httpServer)
        .patch('/comments/1')
        .send(updateCommentDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should update a comment if it exists and the DTO is valid', async () => {
      const updateCommentDto = plainToInstance(UpdateCommentDto, {
        content: 'reee',
      });

      const resp = await request(httpServer)
        .patch('/comments/1')
        .send(updateCommentDto)
        .expect(HttpStatus.OK);

      const updatedComment = plainToInstance(Comment, resp.body);

      expect(updatedComment).not.toEqual(comment);
    });
  });

  describe('when removing a comment', () => {
    it('should throw and exception if the comment does not exist', async () => {
      await request(httpServer)
        .delete('/comments/-1')
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should remove a comment if it exists', async () => {
      await request(httpServer).delete('/comments/1').expect(HttpStatus.OK);

      const resp = await request(httpServer)
        .get('/comments')
        .expect(HttpStatus.OK);

      const allCommentsLocal = resp.body as Comment[];

      expect(allCommentsLocal.length).toBe(0);
    });
  });
});
