import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import TestDataSource from '../../tests/test.datasource';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: Repository<User>;
  let user: User;

  afterAll(async () => {
    await TestDataSource.dropDatabase();
  });

  beforeAll(async () => {
    await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useClass: Repository },
      ],
    }).compile();

    usersRepository = TestDataSource.getRepository(User);
    usersService = new UsersService(usersRepository);

    await TestDataSource.initialize();
  });

  it('should be defined', () => {
    expect(usersRepository).toBeDefined();
    expect(usersService).toBeDefined();
  });

  it('should create a new user', async () => {
    const newUserDto = plainToInstance(CreateUserDto, {
      email: 'john.doe@gmail.com',
      name: 'johndoe',
    });

    const newUser = await usersService.create(newUserDto);

    expect(newUser).toHaveProperty('createdAt');

    user = newUser;
  });

  it('should find all users', async () => {
    const allUsersLocal = await usersService.findAll();

    expect(allUsersLocal.length).toBe(1);
    expect(allUsersLocal[0]).toEqual(user);
  });

  describe('when finding a user by id', () => {
    it('should throw an exception if the id cannot be found', async () => {
      expect(usersService.findOneById(-1)).rejects.toThrow(NotFoundException);
    });

    it('should find a user if the id is found', async () => {
      const foundUser = await usersService.findOneById(1);

      expect(foundUser).toEqual(user);
    });
  });

  describe('when finding a user by email', () => {
    it('should throw an exception if the email cannot be found', async () => {
      expect(usersService.findOneByEmail('john.doe@doe.com')).rejects.toThrow(
        NotFoundException
      );
    });

    it('should find a user if the email is found', async () => {
      const foundUser = await usersService.findOneByEmail('john.doe@gmail.com');

      expect(foundUser).toEqual(user);
    });
  });

  describe('when updating a user', () => {
    it('should throw an exception if the user does not exist', async () => {
      const updateUserDto = plainToInstance(UpdateUserDto, {
        email: 'john.doe.new@gmail.com',
        name: 'johndoenew',
      });

      expect(usersService.update(-1, updateUserDto)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should update a user if it exists', async () => {
      const updateUserDto = plainToInstance(UpdateUserDto, {
        email: 'john.doe.new@gmail.com',
        name: 'johndoenew',
      });

      const updatedUser = await usersService.update(1, updateUserDto);

      expect(updatedUser).not.toEqual(user);
    });
  });

  describe('when removing a user', () => {
    it('should throw and exception if the user does not exist', async () => {
      expect(usersService.remove(-1)).rejects.toThrow(NotFoundException);
    });

    it('should remove a user if it exists', async () => {
      await usersService.remove(1);

      const allUsersLocal = await usersService.findAll();

      expect(allUsersLocal.length).toBe(0);
    });
  });
});
