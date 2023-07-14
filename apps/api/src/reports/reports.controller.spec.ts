import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer/types';
import request from 'supertest';
import { Repository } from 'typeorm';
import TestDataSource from '../../tests/test.datasource';
import { User } from '../users/entities/user.entity';
import { UsersController } from '../users/users.controller';
import { UsersService } from '../users/users.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Report } from './entities/report.entity';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

describe('ReportsController', () => {
  let reportsController: ReportsController;
  let reportsRepository: Repository<Report>;
  let usersRepository: Repository<User>;
  let app: NestApplication;
  let httpServer: unknown;
  const allReports: Report[] = [];
  let report: Report;
  let user: User;

  afterAll(async () => {
    await TestDataSource.dropDatabase();
    await TestDataSource.destroy();
  });

  beforeAll(async () => {
    reportsRepository = TestDataSource.getRepository(Report);
    usersRepository = TestDataSource.getRepository(User);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController, UsersController],
      providers: [
        {
          provide: ReportsService,
          useValue: new ReportsService(reportsRepository),
        },
        { provide: getRepositoryToken(Report), useClass: Repository },
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

    reportsController = module.get<ReportsController>(ReportsController);
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
    expect(reportsController).toBeDefined();
  });

  describe('when creating a new report', () => {
    it('should throw an exception if the DTO is invalid', async () => {
      const newReportDto = plainToInstance(CreateReportDto, {
        user: {
          id: -1,
        },
      });

      await request(httpServer)
        .post('/reports')
        .send(newReportDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should create a new report if the DTO is valid', async () => {
      const newReportDto = plainToInstance(CreateReportDto, {
        content: 'bruh',
        guid: user.guid,
        user: {
          id: user.id,
        },
      });

      const resp = await request(httpServer)
        .post('/reports')
        .send(newReportDto)
        .expect(HttpStatus.CREATED);

      const newReport = plainToInstance(Report, resp.body);

      expect(newReport).toHaveProperty('createdAt');

      report = newReport;
      report.user = user;
      allReports.push(report);
    });
  });

  it('should find all reports', async () => {
    const resp = await request(httpServer)
      .get('/reports')
      .expect(HttpStatus.OK);

    const allReportsLocal = resp.body as Report[];

    expect(allReportsLocal.length).toBe(1);
    expect(allReportsLocal[0]).toEqual(report);
  });

  describe('when finding a report by id', () => {
    it('should throw an exception if the id cannot be found', async () => {
      await request(httpServer)
        .get('/reports/byId/-1')
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should find a report if the id is found', async () => {
      const resp = await request(httpServer)
        .get('/reports/byId/1')
        .expect(HttpStatus.OK);

      const foundReport = plainToInstance(Report, resp.body);

      expect(foundReport).toEqual(report);
    });
  });

  describe('when finding a report by guid', () => {
    it('should throw an exception if the guid cannot be found', async () => {
      await request(httpServer)
        .get('/reports/byContent/reee')
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should find a report if the guid is found', async () => {
      const resp = await request(httpServer)
        .get(`/reports/byGuid/${report.guid}`)
        .expect(HttpStatus.OK);

      const foundReport = plainToInstance(Report, resp.body);

      expect(foundReport).toEqual(report);
    });
  });

  describe('when updating a report', () => {
    it('should throw an exception if the report does not exist', async () => {
      const updateReportDto = plainToInstance(UpdateReportDto, {
        content: 'reee',
      });

      await request(httpServer)
        .put('/reports/-1')
        .send(updateReportDto)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should throw an exception if the report exists and the DTO is invalid', async () => {
      const updateReportDto = plainToInstance(UpdateReportDto, {
        content: '',
      });

      await request(httpServer)
        .patch('/reports/1')
        .send(updateReportDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should update a report if it exists and the DTO is valid', async () => {
      const updateReportDto = plainToInstance(UpdateReportDto, {
        content: 'reee',
        resolved: true,
      });

      const resp = await request(httpServer)
        .patch('/reports/1')
        .send(updateReportDto)
        .expect(HttpStatus.OK);

      const updatedReport = plainToInstance(Report, resp.body);

      expect(updatedReport).not.toEqual(report);
    });
  });

  describe('when removing a report', () => {
    it('should throw and exception if the report does not exist', async () => {
      await request(httpServer)
        .delete('/reports/-1')
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should remove a report if it exists', async () => {
      await request(httpServer).delete('/reports/1').expect(HttpStatus.OK);

      const resp = await request(httpServer)
        .get('/reports')
        .expect(HttpStatus.OK);

      const allReportsLocal = resp.body as Report[];

      expect(allReportsLocal.length).toBe(0);
    });
  });
});
