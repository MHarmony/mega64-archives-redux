import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer/types';
import request from 'supertest';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import TestDataSource from '../../tests/test.datasource';
import { User } from '../users/entities/user.entity';
import { UsersController } from '../users/users.controller';
import { UsersService } from '../users/users.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

describe('TagsController', () => {
  let tagsController: TagsController;
  let tagsRepository: Repository<Tag>;
  let usersRepository: Repository<User>;
  let app: NestApplication;
  let httpServer: unknown;
  const allTags: Tag[] = [];
  let tag: Tag;
  let user: User;

  afterAll(async () => {
    await TestDataSource.dropDatabase();
    await TestDataSource.destroy();
  });

  beforeAll(async () => {
    tagsRepository = TestDataSource.getRepository(Tag);
    usersRepository = TestDataSource.getRepository(User);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagsController, UsersController],
      providers: [
        {
          provide: TagsService,
          useValue: new TagsService(tagsRepository),
        },
        { provide: getRepositoryToken(Tag), useClass: Repository },
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

    tagsController = module.get<TagsController>(TagsController);
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

    const resp = await request(httpServer).post('/users').send({
      email: 'john.doe@gmail.com',
      name: 'johndoe',
    });

    user = plainToInstance(User, resp.body);
  });

  it('should be defined', () => {
    expect(tagsController).toBeDefined();
  });

  describe('when creating a new tag', () => {
    it('should throw an exception if the DTO is invalid', async () => {
      const newTagDto = plainToInstance(CreateTagDto, {
        user: {
          id: -1,
        },
      });

      await request(httpServer)
        .post('/tags')
        .send(newTagDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should create a new tag if the DTO is valid', async () => {
      const newTagDto = plainToInstance(CreateTagDto, {
        content: 'bruh',
        itemGuid: uuidv4(),
        user: {
          id: user.id,
        },
      });

      const resp = await request(httpServer)
        .post('/tags')
        .send(newTagDto)
        .expect(HttpStatus.CREATED);

      const newTag = plainToInstance(Tag, resp.body);

      expect(newTag).toHaveProperty('createdAt');

      tag = newTag;
      tag.user = user;
      allTags.push(tag);
    });
  });

  it('should find all tags', async () => {
    const resp = await request(httpServer).get('/tags').expect(HttpStatus.OK);

    const allTagsLocal = resp.body as Tag[];

    expect(allTagsLocal.length).toBe(1);
    expect(allTagsLocal[0]).toEqual(tag);
  });

  describe('when finding a tag by id', () => {
    it('should throw an exception if the id cannot be found', async () => {
      await request(httpServer)
        .get('/tags/byId/-1')
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should find a tag if the id is found', async () => {
      const resp = await request(httpServer)
        .get('/tags/byId/1')
        .expect(HttpStatus.OK);

      const foundTag = plainToInstance(Tag, resp.body);

      expect(foundTag).toEqual(tag);
    });
  });

  describe('when finding a tag by content', () => {
    it('should throw an exception if the content cannot be found', async () => {
      await request(httpServer)
        .get('/tags/byContent/reee')
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should find a tag if the content is found', async () => {
      const resp = await request(httpServer)
        .get('/tags/byContent/bruh')
        .expect(HttpStatus.OK);

      const foundTag = plainToInstance(Tag, resp.body);

      expect(foundTag).toEqual(tag);
    });
  });

  describe('when updating a tag', () => {
    it('should throw an exception if the tag does not exist', async () => {
      const updateTagDto = plainToInstance(UpdateTagDto, {
        content: 'reee',
      });

      await request(httpServer)
        .put('/tags/-1')
        .send(updateTagDto)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should throw an exception if the tag exists and the DTO is invalid', async () => {
      const updateTagDto = plainToInstance(UpdateTagDto, {
        content: '',
      });

      await request(httpServer)
        .patch('/tags/1')
        .send(updateTagDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should update a tag if it exists and the DTO is valid', async () => {
      const updateTagDto = plainToInstance(UpdateTagDto, {
        content: 'reee',
      });

      const resp = await request(httpServer)
        .patch('/tags/1')
        .send(updateTagDto)
        .expect(HttpStatus.OK);

      const updatedTag = plainToInstance(Tag, resp.body);

      expect(updatedTag).not.toEqual(tag);
    });
  });

  describe('when removing a tag', () => {
    it('should throw and exception if the tag does not exist', async () => {
      await request(httpServer).delete('/tags/-1').expect(HttpStatus.NOT_FOUND);
    });

    it('should remove a tag if it exists', async () => {
      await request(httpServer).delete('/tags/1').expect(HttpStatus.OK);

      const resp = await request(httpServer).get('/tags').expect(HttpStatus.OK);

      const allTagsLocal = resp.body as Tag[];

      expect(allTagsLocal.length).toBe(0);
    });
  });
});
