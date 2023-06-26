import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CreateUser, UpdateUser, User, UserType } from '@mega64/common';
import { plainToInstance } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from './users.service';

describe('UsersService', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let mockUser: User;
  const mockUsers: User[] = [];
  let usersService: UsersService;

  afterEach(() => {
    httpTestingController.verify();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    mockUser = {
      id: 1,
      guid: uuidv4(),
      email: 'john.doe@gmail.com',
      name: 'johndoe',
      type: UserType.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockUsers.push(mockUser);
    usersService = TestBed.inject(UsersService);
  });

  it('should be created', () => {
    expect(usersService).toBeTruthy();
  });

  it('should create a new user', async () => {
    const newUserDto = plainToInstance(CreateUser, {
      email: 'john.doe@gmail.com',
      name: 'johndoe',
    });

    usersService
      .create(newUserDto)
      .then((user) => expect(user).toEqual(mockUser));

    const req = httpTestingController.expectOne('/api/users');

    expect(req.request.method).toEqual('POST');

    req.flush(mockUser);
  });

  it('should find all users', async () => {
    usersService.findAll().then((users) => expect(users).toEqual(mockUsers));

    const req = httpTestingController.expectOne('/api/users');

    expect(req.request.method).toEqual('GET');

    req.flush(mockUsers);
  });

  it('should find a user by id', async () => {
    usersService.findOneById(1).then((user) => expect(user).toEqual(mockUser));

    const req = httpTestingController.expectOne('/api/users/byId/1');

    expect(req.request.method).toEqual('GET');

    req.flush(mockUser);
  });

  it('should find a user by email', async () => {
    usersService
      .findOneByEmail('john.doe@gmail.com')
      .then((user) => expect(user).toEqual(mockUser));

    const req = httpTestingController.expectOne(
      encodeURI('/api/users/byEmail/john.doe@gmail.com')
    );

    expect(req.request.method).toEqual('GET');

    req.flush(mockUser);
  });

  it('should update a user', async () => {
    const updateUserDto = plainToInstance(UpdateUser, {
      email: 'john.doe2@gmail.com',
      name: 'johndoe2',
    });

    usersService
      .update(1, updateUserDto)
      .then((user) => expect(user).toEqual(mockUser));

    const req = httpTestingController.expectOne('/api/users/1');

    expect(req.request.method).toEqual('PATCH');

    req.flush(mockUser);
  });

  it('should delete a user', async () => {
    usersService.remove(1).then((x) => expect(x).toBeNull());

    const req = httpTestingController.expectOne('/api/users/1');

    expect(req.request.method).toEqual('DELETE');

    req.flush(null);
  });

  it('should get the current user', async () => {
    usersService.currentUser = mockUser;

    const currentUser = usersService.getCurrentUser();

    expect(currentUser).toEqual(mockUser);
  });

  it('should sign out', async () => {
    usersService.currentUser = mockUser;

    usersService.signOut();

    expect(usersService.getCurrentUser()).toBeUndefined();
  });
});
