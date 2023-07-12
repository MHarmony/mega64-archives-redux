import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateReport, Report, UpdateReport } from '@mega64/common';
import { firstValueFrom } from 'rxjs';

/**
 * The Reports service.
 *
 * @decorator `@Injectable`
 */
@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  /**
   * The constructor for ReportsService.
   *
   * @param httpClient - The HttpClient.
   */
  public constructor(private readonly httpClient: HttpClient) {}

  /**
   * Creates a new report.
   *
   * @param createReportDto - The DTO with the data to create the report with.
   *
   * @returns The newly created report.
   */
  public async create(createReportDto: CreateReport): Promise<Report> {
    return firstValueFrom(
      this.httpClient.post<Report>('/api/reports', createReportDto),
    );
  }

  /**
   * Finds all reports.
   *
   * @returns An array of all reports.
   */
  public async findAll(): Promise<Report[]> {
    return firstValueFrom(this.httpClient.get<Report[]>('/api/reports'));
  }

  /**
   * Finds a report by its reported item guid.
   *
   * @param guid - The unique global id of the report item to find.
   *
   * @returns The report with the provided guid.
   */
  public async findOneByGuid(guid: string): Promise<Report> {
    return firstValueFrom(
      this.httpClient.get<Report>(`/api/reports/byGuid/${guid}`),
    );
  }

  /**
   * Finds a report by its id.
   *
   * @param id - The id of the report to find.
   *
   * @returns The report with the provided id.
   */
  public async findOneById(id: number): Promise<Report> {
    return firstValueFrom(
      this.httpClient.get<Report>(`/api/reports/byId/${id}`),
    );
  }

  /**
   * Updates the content of the report with the provided id.
   *
   * @param id - The id of the report to update.
   * @param updateTag - The DTO with the data to update the report with.
   *
   * @returns The updated report.
   */
  public async update(
    id: number,
    updateReportDto: UpdateReport,
  ): Promise<Report> {
    return firstValueFrom(
      this.httpClient.patch<Report>(`/api/reports/${id}`, updateReportDto),
    );
  }

  /**
   * Removes a report.
   *
   * @param id - The id of the report to remove.
   */
  public async remove(id: number): Promise<void> {
    return firstValueFrom(this.httpClient.delete<void>(`/api/reports/${id}`));
  }
}
