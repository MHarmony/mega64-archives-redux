import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CreateReport, Report, UpdateReport, UserType } from '@mega64/common';
import { plainToInstance } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';
import { ReportsService } from './reports.service';

describe('ReportsService', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let mockReport: Report;
  const mockReports: Report[] = [];
  let reportsService: ReportsService;

  afterEach(() => {
    httpTestingController.verify();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    mockReport = {
      id: 1,
      guid: uuidv4(),
      resolved: false,
      content: 'john.doe@gmail.com',
      user: {
        id: 1,
        email: 'john.doe.@gmail.com',
        guid: uuidv4(),
        name: 'johndoe',
        type: UserType.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockReports.push(mockReport);
    reportsService = TestBed.inject(ReportsService);
  });

  it('should be created', () => {
    expect(reportsService).toBeTruthy();
  });

  it('should create a new report', async () => {
    const newReportDto = plainToInstance(CreateReport, {
      content: 'bruh',
      user: {
        id: 1,
      },
    });

    reportsService
      .create(newReportDto)
      .then((report) => expect(report).toEqual(mockReport));

    const req = httpTestingController.expectOne('/api/reports');

    expect(req.request.method).toEqual('POST');

    req.flush(mockReport);
  });

  it('should find all reports', async () => {
    reportsService
      .findAll()
      .then((reports) => expect(reports).toEqual(mockReports));

    const req = httpTestingController.expectOne('/api/reports');

    expect(req.request.method).toEqual('GET');

    req.flush(mockReports);
  });

  it('should find a report by id', async () => {
    reportsService
      .findOneById(1)
      .then((report) => expect(report).toEqual(mockReport));

    const req = httpTestingController.expectOne('/api/reports/byId/1');

    expect(req.request.method).toEqual('GET');

    req.flush(mockReport);
  });

  it('should find a report by guid', async () => {
    reportsService
      .findOneByGuid(mockReport.guid)
      .then((report) => expect(report).toEqual(mockReport));

    const req = httpTestingController.expectOne(
      `/api/reports/byGuid/${mockReport.guid}`,
    );

    expect(req.request.method).toEqual('GET');

    req.flush(mockReport);
  });

  it('should update a report', async () => {
    const updateReportDto = plainToInstance(UpdateReport, {
      content: 'reee',
    });

    reportsService
      .update(1, updateReportDto)
      .then((report) => expect(report).toEqual(mockReport));

    const req = httpTestingController.expectOne('/api/reports/1');

    expect(req.request.method).toEqual('PATCH');

    req.flush(mockReport);
  });

  it('should delete a report', async () => {
    reportsService.remove(1).then((x) => expect(x).toBeNull());

    const req = httpTestingController.expectOne('/api/reports/1');

    expect(req.request.method).toEqual('DELETE');

    req.flush(null);
  });
});
