import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import TestDataSource from '../../tests/test.datasource';
import { Report } from '../reports/entities/report.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportsService } from './reports.service';

describe('ReportsService', () => {
  let reportsService: ReportsService;
  let usersService: UsersService;
  let reportsRepository: Repository<Report>;
  let usersRepository: Repository<User>;
  let report: Report;
  let user: User;

  afterAll(async () => {
    await TestDataSource.dropDatabase();
    await TestDataSource.destroy();
  });

  beforeAll(async () => {
    await Test.createTestingModule({
      providers: [
        ReportsService,
        { provide: getRepositoryToken(Report), useClass: Repository },
        UsersService,
        { provide: getRepositoryToken(User), useClass: Repository },
      ],
    }).compile();

    reportsRepository = TestDataSource.getRepository(Report);
    reportsService = new ReportsService(reportsRepository);
    usersRepository = TestDataSource.getRepository(User);
    usersService = new UsersService(usersRepository);

    await TestDataSource.initialize();

    user = await usersService.create({
      email: 'john.doe@gmail.com',
      name: 'johndoe',
    });
  });

  it('should be defined', () => {
    expect(reportsRepository).toBeDefined();
    expect(reportsService).toBeDefined();
  });

  it('should create a new report', async () => {
    const newReportDto = plainToInstance(CreateReportDto, {
      content: 'bruh',
      guid: user.guid,
      user: {
        id: user.id,
      },
    });

    const newReport = await reportsService.create(newReportDto);

    expect(newReport).toHaveProperty('createdAt');

    report = newReport;
    report.user = user;
  });

  it('should find all reports', async () => {
    const allReportsLocal = await reportsService.findAll();

    expect(allReportsLocal.length).toBe(1);
    expect(allReportsLocal[0]).toEqual(report);
  });

  describe('when finding a report by id', () => {
    it('should throw an exception if the id cannot be found', async () => {
      expect(reportsService.findOneById(-1)).rejects.toThrow(NotFoundException);
    });

    it('should find a report if the id is found', async () => {
      const foundReport = await reportsService.findOneById(1);

      expect(foundReport).toEqual(report);
    });
  });

  describe('when finding a report by guid', () => {
    it('should throw an exception if the guid cannot be found', async () => {
      expect(reportsService.findOneByGuid(uuidv4())).rejects.toThrow(
        NotFoundException
      );
    });

    it('should find a report if the guid is found', async () => {
      const foundReport = await reportsService.findOneByGuid(report.guid);

      expect(foundReport).toEqual(report);
    });
  });

  describe('when updating a report', () => {
    it('should throw an exception if the report does not exist', async () => {
      const updateReportDto = plainToInstance(UpdateReportDto, {
        content: 'reee',
      });

      expect(reportsService.update(-1, updateReportDto)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should update a report if it exists', async () => {
      const updateReportDto = plainToInstance(UpdateReportDto, {
        content: 'reee',
        resvoled: true,
      });

      const updatedTag = await reportsService.update(1, updateReportDto);

      expect(updatedTag).not.toEqual(report);
    });
  });

  describe('when removing a report', () => {
    it('should throw and exception if the report does not exist', async () => {
      expect(reportsService.remove(-1)).rejects.toThrow(NotFoundException);
    });

    it('should remove a report if it exists', async () => {
      await reportsService.remove(1);

      const allTagsLocal = await reportsService.findAll();

      expect(allTagsLocal.length).toBe(0);
    });
  });
});
