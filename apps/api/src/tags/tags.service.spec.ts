import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import TestDataSource from '../../tests/test.datasource';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
import { TagsService } from './tags.service';

describe('TagsService', () => {
  let tagsService: TagsService;
  let usersService: UsersService;
  let tagsRepository: Repository<Tag>;
  let usersRepository: Repository<User>;
  let tag: Tag;
  let user: User;

  afterAll(async () => {
    await TestDataSource.dropDatabase();
    await TestDataSource.destroy();
  });

  beforeAll(async () => {
    await Test.createTestingModule({
      providers: [
        TagsService,
        { provide: getRepositoryToken(Tag), useClass: Repository },
        UsersService,
        { provide: getRepositoryToken(User), useClass: Repository },
      ],
    }).compile();

    tagsRepository = TestDataSource.getRepository(Tag);
    tagsService = new TagsService(tagsRepository);
    usersRepository = TestDataSource.getRepository(User);
    usersService = new UsersService(usersRepository);

    await TestDataSource.initialize();

    user = await usersService.create({
      email: 'john.doe@gmail.com',
      name: 'johndoe',
    });
  });

  it('should be defined', () => {
    expect(tagsRepository).toBeDefined();
    expect(tagsService).toBeDefined();
  });

  it('should create a new tag', async () => {
    const newTagDto = plainToInstance(CreateTagDto, {
      content: 'bruh',
      itemGuid: uuidv4(),
      user: {
        id: user.id,
      },
    });

    const newTag = await tagsService.create(newTagDto);

    expect(newTag).toHaveProperty('createdAt');

    tag = newTag;
    tag.user = user;
  });

  it('should find all tags', async () => {
    const allTagsLocal = await tagsService.findAll();

    expect(allTagsLocal.length).toBe(1);
    expect(allTagsLocal[0]).toEqual(tag);
  });

  describe('when finding a tag by id', () => {
    it('should throw an exception if the id cannot be found', async () => {
      expect(tagsService.findOneById(-1)).rejects.toThrow(NotFoundException);
    });

    it('should find a tag if the id is found', async () => {
      const foundTag = await tagsService.findOneById(1);

      expect(foundTag).toEqual(tag);
    });
  });

  describe('when finding a tag by content', () => {
    it('should throw an exception if the content cannot be found', async () => {
      expect(tagsService.findOneByContent('reeee')).rejects.toThrow(
        NotFoundException
      );
    });

    it('should find a tag if the content is found', async () => {
      const foundTag = await tagsService.findOneByContent('bruh');

      expect(foundTag).toEqual(tag);
    });
  });

  describe('when updating a tag', () => {
    it('should throw an exception if the tag does not exist', async () => {
      const updateTagDto = plainToInstance(UpdateTagDto, {
        content: 'reee',
      });

      expect(tagsService.update(-1, updateTagDto)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should update a tag if it exists', async () => {
      const updateTagDto = plainToInstance(UpdateTagDto, {
        content: 'reee',
      });

      const updatedTag = await tagsService.update(1, updateTagDto);

      expect(updatedTag).not.toEqual(tag);
    });
  });

  describe('when removing a tag', () => {
    it('should throw and exception if the tag does not exist', async () => {
      expect(tagsService.remove(-1)).rejects.toThrow(NotFoundException);
    });

    it('should remove a tag if it exists', async () => {
      await tagsService.remove(1);

      const allTagsLocal = await tagsService.findAll();

      expect(allTagsLocal.length).toBe(0);
    });
  });
});
