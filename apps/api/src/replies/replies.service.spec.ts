import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer/types';
import { Repository } from 'typeorm';
import TestDataSource from '../../tests/test.datasource';
import { CommentsService } from '../comments/comments.service';
import { Comment } from '../comments/entities/comment.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { Reply } from './entities/reply.entity';
import { RepliesService } from './replies.service';

describe('RepliesService', () => {
  let commentsService: CommentsService;
  let repliesService: RepliesService;
  let usersService: UsersService;
  let commentsRepository: Repository<Comment>;
  let repliesRepository: Repository<Reply>;
  let usersRepository: Repository<User>;
  let comment: Comment;
  let reply: Reply;
  let user: User;

  afterAll(async () => {
    await TestDataSource.dropDatabase();
    await TestDataSource.destroy();
  });

  beforeAll(async () => {
    await Test.createTestingModule({
      providers: [
        CommentsService,
        { provide: getRepositoryToken(Comment), useClass: Repository },
        RepliesService,
        { provide: getRepositoryToken(Reply), useClass: Repository },
        UsersService,
        { provide: getRepositoryToken(User), useClass: Repository },
      ],
    }).compile();

    commentsRepository = TestDataSource.getRepository(Comment);
    commentsService = new CommentsService(commentsRepository);
    repliesRepository = TestDataSource.getRepository(Reply);
    repliesService = new RepliesService(repliesRepository);
    usersRepository = TestDataSource.getRepository(User);
    usersService = new UsersService(usersRepository);

    await TestDataSource.initialize();

    user = await usersService.create({
      email: 'john.doe@gmail.com',
      name: 'johndoe',
    });

    user = plainToInstance(User, user);

    comment = await commentsService.create({
      content: 'bruh',
      user: {
        id: user.id,
      },
    });

    comment.user = plainToInstance(User, user);
  });

  it('should be defined', () => {
    expect(repliesRepository).toBeDefined();
    expect(repliesService).toBeDefined();
  });

  it('should create a new reply', async () => {
    const newReplyDto = plainToInstance(CreateReplyDto, {
      content: 'bruh',
      user: {
        id: user.id,
      },
      parentComment: {
        id: comment.id,
      },
    });

    const newReply = await repliesService.create(newReplyDto);

    newReply.parentComment = plainToInstance(Comment, comment);
    newReply.user = plainToInstance(User, user);

    reply = plainToInstance(Reply, newReply);

    expect(newReply).toHaveProperty('createdAt');
  });

  it('should find all replies', async () => {
    const allRepliesLocal = await repliesService.findAll();

    expect(allRepliesLocal.length).toBe(1);
    expect(allRepliesLocal[0]).toEqual(reply);
  });

  describe('when finding a reply by id', () => {
    it('should throw an exception if the id cannot be found', async () => {
      expect(repliesService.findOneById(-1)).rejects.toThrow(NotFoundException);
    });

    it('should find a reply if the id is found', async () => {
      const foundReply = await repliesService.findOneById(1);

      expect(foundReply).toEqual(reply);
    });
  });

  describe('when finding a reply by content', () => {
    it('should throw an exception if the content cannot be found', async () => {
      expect(repliesService.findOneByContent('reeee')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should find a reply if the content is found', async () => {
      const foundReply = await repliesService.findOneByContent('bruh');

      expect(foundReply).toEqual(reply);
    });
  });

  describe('when updating a reply', () => {
    it('should throw an exception if the reply does not exist', async () => {
      const updateReplyDto = plainToInstance(UpdateReplyDto, {
        content: 'reee',
      });

      expect(repliesService.update(-1, updateReplyDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update a reply if it exists', async () => {
      const updateReplyDto = plainToInstance(CreateReplyDto, {
        content: 'reee',
      });

      const updatedReply = await repliesService.update(1, updateReplyDto);

      expect(updatedReply).not.toEqual(reply);
    });
  });

  describe('when removing a reply', () => {
    it('should throw and exception if the reply does not exist', async () => {
      expect(repliesService.remove(-1)).rejects.toThrow(NotFoundException);
    });

    it('should remove a reply if it exists', async () => {
      await repliesService.remove(1);

      const allRepliesLocal = await repliesService.findAll();

      expect(allRepliesLocal.length).toBe(0);
    });
  });
});
