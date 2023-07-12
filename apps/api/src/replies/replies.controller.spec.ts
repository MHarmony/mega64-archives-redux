import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import request from 'supertest';
import { Repository } from 'typeorm';
import TestDataSource from '../../tests/test.datasource';
import { CommentsController } from '../comments/comments.controller';
import { CommentsService } from '../comments/comments.service';
import { Comment } from '../comments/entities/comment.entity';
import { User } from '../users/entities/user.entity';
import { UsersController } from '../users/users.controller';
import { UsersService } from '../users/users.service';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { Reply } from './entities/reply.entity';
import { RepliesController } from './replies.controller';
import { RepliesService } from './replies.service';

describe('RepliesController', () => {
  let commentsRepository: Repository<Comment>;
  let repliesController: RepliesController;
  let repliesRepository: Repository<Reply>;
  let usersRepository: Repository<User>;
  let app: NestApplication;
  let httpServer: unknown;
  let comment: Comment;
  let reply: Reply;
  let user: User;

  afterAll(async () => {
    await TestDataSource.dropDatabase();
    await TestDataSource.destroy();
  });

  beforeAll(async () => {
    commentsRepository = TestDataSource.getRepository(Comment);
    repliesRepository = TestDataSource.getRepository(Reply);
    usersRepository = TestDataSource.getRepository(User);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RepliesController, UsersController, CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: new CommentsService(commentsRepository),
        },
        {
          provide: RepliesService,
          useValue: new RepliesService(repliesRepository),
        },
        { provide: getRepositoryToken(Reply), useClass: Repository },
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

    repliesController = module.get<RepliesController>(RepliesController);
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

    const userResp = await request(httpServer).post('/users').send({
      email: 'john.doe@gmail.com',
      name: 'johndoe',
    });

    user = plainToInstance(User, userResp.body);

    const commentResp = await request(httpServer)
      .post('/comments')
      .send({
        content: 'bruh',
        user: {
          id: user.id,
        },
      });

    comment = plainToInstance(Comment, commentResp.body);
    comment.user = plainToInstance(User, user);
  });

  it('should be defined', () => {
    expect(repliesController).toBeDefined();
  });

  describe('when creating a new reply', () => {
    it('should throw an exception if the DTO is invalid', async () => {
      const newReplyDto = plainToInstance(CreateReplyDto, {
        user: {
          id: -1,
        },
      });

      await request(httpServer)
        .post('/replies')
        .send(newReplyDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should create a new reply if the DTO is valid', async () => {
      const newReplyDto = plainToInstance(CreateReplyDto, {
        content: 'bruh',
        parentComment: {
          id: comment.id,
        },
        user: {
          id: user.id,
        },
      });

      const resp = await request(httpServer)
        .post('/replies')
        .send(newReplyDto)
        .expect(HttpStatus.CREATED);

      const newReply = plainToInstance(Reply, resp.body);

      newReply.parentComment = plainToInstance(Comment, comment);
      newReply.user = plainToInstance(User, user);

      reply = plainToInstance(Reply, newReply);

      expect(newReply).toHaveProperty('createdAt');
    });
  });

  it('should find all replies', async () => {
    const resp = await request(httpServer)
      .get('/replies')
      .expect(HttpStatus.OK);

    const allRepliesLocal = resp.body as Reply[];

    expect(allRepliesLocal.length).toBe(1);
    expect(allRepliesLocal[0]).toEqual(reply);
  });

  describe('when finding a reply by id', () => {
    it('should throw an exception if the id cannot be found', async () => {
      await request(httpServer)
        .get('/replies/byId/-1')
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should find a reply if the id is found', async () => {
      const resp = await request(httpServer)
        .get('/replies/byId/1')
        .expect(HttpStatus.OK);

      const foundReply = plainToInstance(Reply, resp.body);

      expect(foundReply).toEqual(reply);
    });
  });

  describe('when finding a reply by content', () => {
    it('should throw an exception if the content cannot be found', async () => {
      await request(httpServer)
        .get('/replies/byContent/reee')
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should find a reply if the content is found', async () => {
      const resp = await request(httpServer)
        .get('/replies/byContent/bruh')
        .expect(HttpStatus.OK);

      const foundReply = plainToInstance(Reply, resp.body);

      expect(foundReply).toEqual(reply);
    });
  });

  describe('when updating a reply', () => {
    it('should throw an exception if the reply does not exist', async () => {
      const updateReplyDto = plainToInstance(UpdateReplyDto, {
        content: 'reee',
      });

      await request(httpServer)
        .put('/replies/-1')
        .send(updateReplyDto)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should throw an exception if the reply exists and the DTO is invalid', async () => {
      const updateReplyDto = plainToInstance(UpdateReplyDto, {
        content: '',
      });

      await request(httpServer)
        .patch('/replies/1')
        .send(updateReplyDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should update a reply if it exists and the DTO is valid', async () => {
      const updateReplyDto = plainToInstance(UpdateReplyDto, {
        content: 'reee',
      });

      const resp = await request(httpServer)
        .patch('/replies/1')
        .send(updateReplyDto)
        .expect(HttpStatus.OK);

      const updatedReply = plainToInstance(Reply, resp.body);

      expect(updatedReply).not.toEqual(reply);
    });
  });

  describe('when removing a reply', () => {
    it('should throw and exception if the reply does not exist', async () => {
      await request(httpServer)
        .delete('/replies/-1')
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should remove a reply if it exists', async () => {
      await request(httpServer).delete('/replies/1').expect(HttpStatus.OK);

      const resp = await request(httpServer)
        .get('/replies')
        .expect(HttpStatus.OK);

      const allRepliesLocal = resp.body as Reply[];

      expect(allRepliesLocal.length).toBe(0);
    });
  });
});
