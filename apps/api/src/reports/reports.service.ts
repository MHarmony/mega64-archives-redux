import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Report } from './entities/report.entity';

/**
 * The service for interacting with {@link Report} entities.
 *
 * @decorator `@Injectable`
 */
@Injectable()
export class ReportsService {
  /**
   * The constructor for ReportsService.
   *
   * @param reportsRepository - The ReportsRepository.
   */
  public constructor(
    @InjectRepository(Report)
    private readonly reportsRepository: Repository<Report>,
  ) {}

  /**
   * Creates a new report.
   *
   * @param createReportDto - The DTO with the data to create the report with.
   *
   * @returns The newly created report.
   */
  public async create(createReportDto: CreateReportDto): Promise<Report> {
    return this.reportsRepository.save(createReportDto);
  }

  /**
   * Finds all reports.
   *
   * @returns An array of all reports.
   */
  public async findAll(): Promise<Report[]> {
    return this.reportsRepository.find({ order: { updatedAt: 'DESC' } });
  }

  /**
   * Finds a report by its associated guid.
   *
   * @param guid - The guid of the item associated with the report to find.
   *
   * @returns The report with the associated guid.
   *
   * @throws `NotFoundException`
   * This exception is thrown if the report with the associated guid does not exist.
   */
  public async findOneByGuid(guid: string): Promise<Report> {
    const foundReport = await this.reportsRepository.findOneBy({ guid });

    if (!foundReport) {
      throw new NotFoundException(
        `The report with associated guid ${guid} was not found.`,
      );
    }

    return foundReport;
  }

  /**
   * Finds a report by its id.
   *
   * @param id - The id of the report to find.
   *
   * @returns The report with the provided id.
   *
   * @throws `NotFoundException`
   * This exception is thrown if the report with the provided id does not exist.
   */
  public async findOneById(id: number): Promise<Report> {
    const foundReport = await this.reportsRepository.findOneBy({ id });

    if (!foundReport) {
      throw new NotFoundException(`The report with id ${id} was not found.`);
    }

    return foundReport;
  }

  /**
   * Updates the content and/or resolution status of a report with the provided id.
   *
   * @param id - The id of the report to update.
   * @param updateReportDto - The DTO with the data to update the report with.
   *
   * @returns The updated report
   */
  public async update(
    id: number,
    updateReportDto: UpdateReportDto,
  ): Promise<Report> {
    const foundReport = await this.findOneById(id);

    if (updateReportDto.content) {
      foundReport.content = updateReportDto.content;
    }

    if (updateReportDto.resolved !== undefined) {
      foundReport.resolved = updateReportDto.resolved;
    }

    return this.reportsRepository.save(foundReport);
  }

  /**
   * Removes a report.
   *
   * @param id - The id of the report to remove.
   */
  public async remove(id: number): Promise<void> {
    const foundReport = await this.findOneById(id);

    await this.reportsRepository.remove(foundReport);
  }
}
