import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import request from 'supertest';
import { Repository } from 'typeorm';
import TestDataSource from '../../tests/test.datasource';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersRepository: Repository<User>;
  let app: NestApplication;
  let httpServer: unknown;
  const allUsers: User[] = [];
  let user: User;

  afterAll(async () => {
    await TestDataSource.dropDatabase();
    await TestDataSource.destroy();
  });

  beforeAll(async () => {
    usersRepository = TestDataSource.getRepository(User);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
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

    usersController = module.get<UsersController>(UsersController);
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
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('when creating a new user', () => {
    it('should throw an exception if the DTO is invalid', async () => {
      const newUserDto = plainToInstance(CreateUserDto, {
        email: 'john.doe',
        name: 'johndoe',
      });

      await request(httpServer)
        .post('/users')
        .send(newUserDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should create a new user if the DTO is valid', async () => {
      const newUserDto = plainToInstance(CreateUserDto, {
        email: 'john.doe@gmail.com',
        name: 'johndoe',
      });

      const resp = await request(httpServer)
        .post('/users')
        .send(newUserDto)
        .expect(HttpStatus.CREATED);

      const newUser = plainToInstance(User, resp.body);

      expect(newUser).toHaveProperty('createdAt');

      user = newUser;
      allUsers.push(user);
    });
  });

  it('should find all users', async () => {
    const resp = await request(httpServer).get('/users').expect(HttpStatus.OK);

    const allUsersLocal = resp.body as User[];

    expect(allUsersLocal.length).toBe(1);
    expect(allUsersLocal[0]).toEqual(user);
  });

  describe('when finding a user by id', () => {
    it('should throw an exception if the id cannot be found', async () => {
      await request(httpServer)
        .get('/users/byId/-1')
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should find a user if the id is found', async () => {
      const resp = await request(httpServer)
        .get('/users/byId/1')
        .expect(HttpStatus.OK);

      const foundUser = plainToInstance(User, resp.body);

      expect(foundUser).toEqual(user);
    });
  });

  describe('when finding a user by email', () => {
    it('should throw an exception if the email cannot be found', async () => {
      await request(httpServer)
        .get(encodeURI('/users/byEmail/john.doe@doe.com'))
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should find a user if the email is found', async () => {
      const resp = await request(httpServer)
        .get(encodeURI('/users/byEmail/john.doe@gmail.com'))
        .expect(HttpStatus.OK);

      const foundUser = plainToInstance(User, resp.body);

      expect(foundUser).toEqual(user);
    });
  });

  describe('when updating a user', () => {
    it('should throw an exception if the user does not exist', async () => {
      const updateUserDto = plainToInstance(UpdateUserDto, {
        email: 'john.doe.new@gmail.com',
        name: 'johndoenew',
      });

      await request(httpServer)
        .put('/users/-1')
        .send(updateUserDto)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should throw an exception if the user exists and the DTO is invalid', async () => {
      const updateUserDto = plainToInstance(UpdateUserDto, {
        email: 'john.doe.new',
        name: 'johndoenew',
      });

      await request(httpServer)
        .patch('/users/1')
        .send(updateUserDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should update a user if it exists and the DTO is valid', async () => {
      const updateUserDto = plainToInstance(UpdateUserDto, {
        email: 'john.doe.new@gmail.com',
        name: 'johndoenew',
      });

      const resp = await request(httpServer)
        .patch('/users/1')
        .send(updateUserDto)
        .expect(HttpStatus.OK);

      const updatedUser = plainToInstance(User, resp.body);

      expect(updatedUser).not.toEqual(user);
    });
  });

  describe('when removing a user', () => {
    it('should throw and exception if the user does not exist', async () => {
      await request(httpServer)
        .delete('/users/-1')
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should remove a user if it exists', async () => {
      await request(httpServer).delete('/users/1').expect(HttpStatus.OK);

      const resp = await request(httpServer)
        .get('/users')
        .expect(HttpStatus.OK);

      const allUsersLocal = resp.body as User[];

      expect(allUsersLocal.length).toBe(0);
    });
  });
});
