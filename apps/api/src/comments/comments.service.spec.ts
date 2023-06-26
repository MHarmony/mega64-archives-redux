import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import TestDataSource from '../../tests/test.datasource';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

describe('CommentsService', () => {
  let commentsService: CommentsService;
  let usersService: UsersService;
  let commentsRepository: Repository<Comment>;
  let usersRepository: Repository<User>;
  const allComments: Comment[] = [];
  let comment: Comment;
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
        UsersService,
        { provide: getRepositoryToken(User), useClass: Repository },
      ],
    }).compile();

    commentsRepository = TestDataSource.getRepository(Comment);
    commentsService = new CommentsService(commentsRepository);
    usersRepository = TestDataSource.getRepository(User);
    usersService = new UsersService(usersRepository);

    await TestDataSource.initialize();

    user = await usersService.create({
      email: 'john.doe@gmail.com',
      name: 'johndoe',
    });

    user = plainToInstance(User, user);
  });

  it('should be defined', () => {
    expect(commentsRepository).toBeDefined();
    expect(commentsService).toBeDefined();
  });

  it('should create a new comment', async () => {
    const newCommentDto = plainToInstance(CreateCommentDto, {
      content: 'bruh',
      user: {
        id: user.id,
      },
    });

    const newComment = await commentsService.create(newCommentDto);

    expect(newComment).toHaveProperty('createdAt');

    newComment.user = plainToInstance(User, user);

    comment = plainToInstance(Comment, newComment);
    allComments.push(comment);
  });

  it('should find all comments', async () => {
    const allCommentsLocal = await commentsService.findAll();

    expect(allCommentsLocal.length).toBe(1);
    expect(allCommentsLocal[0]).toEqual(comment);
  });

  describe('when finding a comment by id', () => {
    it('should throw an exception if the id cannot be found', async () => {
      expect(commentsService.findOneById(-1)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should find a comment if the id is found', async () => {
      const foundComment = await commentsService.findOneById(1);

      expect(foundComment).toEqual(comment);
    });
  });

  describe('when finding a comment by content', () => {
    it('should throw an exception if the content cannot be found', async () => {
      expect(commentsService.findOneByContent('reeee')).rejects.toThrow(
        NotFoundException
      );
    });

    it('should find a comment if the content is found', async () => {
      const foundComment = await commentsService.findOneByContent('bruh');

      expect(foundComment).toEqual(comment);
    });
  });

  describe('when updating a comment', () => {
    it('should throw an exception if the comment does not exist', async () => {
      const updateCommentDto = plainToInstance(UpdateCommentDto, {
        content: 'reee',
      });

      expect(commentsService.update(-1, updateCommentDto)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should update a comment if it exists', async () => {
      const updateCommentDto = plainToInstance(CreateCommentDto, {
        content: 'reee',
      });

      const updatedComment = await commentsService.update(1, updateCommentDto);

      expect(updatedComment).not.toEqual(comment);
    });
  });

  describe('when removing a comment', () => {
    it('should throw and exception if the comment does not exist', async () => {
      expect(commentsService.remove(-1)).rejects.toThrow(NotFoundException);
    });

    it('should remove a comment if it exists', async () => {
      await commentsService.remove(1);

      const allCommentsLocal = await commentsService.findAll();

      expect(allCommentsLocal.length).toBe(0);
    });
  });
});
