import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Report } from './entities/report.entity';
import { ReportsService } from './reports.service';

/**
 * The Reports controller.
 *
 * @decorator `@ApiReports`
 * @decorator `@Controller`
 */
@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  /**
   * The constructor for ReportsController.
   *
   * @param reportsService - The ReportsService.
   */
  constructor(private readonly reportsService: ReportsService) {}

  /**
   * Creates a new report.
   *
   * @decorator `@ApiBearerAuth`
   * @decorator `@ApiOperation`
   * @decorator `@ApiBody`
   * @decorator `@ApiCreatedResponse`
   * @decorator `@ApiBadRequestResponse`
   * @decorator `@UseGuards`
   * @decorator `@Post`
   *
   * @param createReportDto - The DTO with the data to create the report with.
   *
   * @returns The newly created report.
   */
  @ApiBearerAuth('jwt')
  @ApiOperation({
    description: 'Creates a new report.',
    summary: 'Creates a new report.',
  })
  @ApiBody({
    description: 'The DTO with the data to create the report with.',
    required: true,
    type: CreateReportDto,
  })
  @ApiCreatedResponse({
    description: 'Successfully created a new report.',
    type: Report,
  })
  @ApiBadRequestResponse({
    description: 'The DTO is invalid.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  public async create(
    @Body() createReportDto: CreateReportDto
  ): Promise<Report> {
    return this.reportsService.create(createReportDto);
  }

  /**
   * Finds all reports.
   *
   * @decorator `@ApiBearerAuth`
   * @decorator `@ApiOperation`
   * @decorator `@ApiOkResponse`
   * @decorator `@ApiUnauthorizedResponse`
   * @decorator `@UseGuards`
   * @decorator `@Get`
   *
   * @returns An array of all reports.
   */
  @ApiBearerAuth('jwt')
  @ApiOperation({
    description: 'Finds all reports.',
    summary: 'Finds all reports.',
  })
  @ApiOkResponse({
    description: 'Successfully found all reports.',
    type: [Report],
  })
  @ApiUnauthorizedResponse({
    description: 'Please login before calling this endpoint.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  public async findAll(): Promise<Report[]> {
    return this.reportsService.findAll();
  }

  /**
   * Finds a report by its content.
   *
   * @decorator `@ApiBearerAuth`
   * @decorator `@ApiOperation`
   * @decorator `@ApiParam`
   * @decorator `@ApiOkResponse`
   * @decorator `@ApiNotFoundResponse`
   * @decorator `@UseGuards`
   * @decorator `@Get`
   *
   * @param content - The content of the report to find.
   *
   * @returns The report with the provided content.
   */
  @ApiBearerAuth('jwt')
  @ApiOperation({
    description: 'Finds a report by its associated guid.',
    summary: 'Finds a report by its associated guid.',
  })
  @ApiParam({
    allowEmptyValue: false,
    description: 'The associated guid of the report to find.',
    example: uuidv4(),
    name: 'guid',
    required: true,
    type: String,
  })
  @ApiOkResponse({
    description: 'Successfully found the report with the provided content.',
    type: Report,
  })
  @ApiNotFoundResponse({
    description: 'Could not find the report with the provided content.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('/byGuid/:guid')
  public async findOneByGuid(@Param('guid') guid: string): Promise<Report> {
    return this.reportsService.findOneByGuid(guid);
  }

  /**
   * Finds a report by its id.
   *
   * @decorator `@ApiBearerAuth`
   * @decorator `@ApiOperation`
   * @decorator `@ApiParam`
   * @decorator `@ApiOkResponse`
   * @decorator `@ApiNotFoundResponse`
   * @decorator `@ApiUnauthorizedResponse`
   * @decorator `@UseGuards`
   * @decorator `@Get`
   *
   * @param id - The id of the report to find.
   *
   * @returns The report with the provided id.
   */
  @ApiBearerAuth('jwt')
  @ApiOperation({
    description: 'Finds a report by its id.',
    summary: 'Finds a report by its id.',
  })
  @ApiParam({
    allowEmptyValue: false,
    description: 'The id of the report to find.',
    example: 1,
    name: 'id',
    required: true,
    type: Number,
  })
  @ApiOkResponse({
    description: 'Successfully found the report with the provided id.',
    type: Report,
  })
  @ApiNotFoundResponse({
    description: 'Could not find the report with the provided id.',
  })
  @ApiUnauthorizedResponse({
    description: 'Please login before calling this endpoint.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('/byId/:id')
  public async findOneById(@Param('id') id: string): Promise<Report> {
    return this.reportsService.findOneById(+id);
  }

  /**
   * Updates the content and/or name of the report with the provided id.
   *
   * @decorator `@ApiBearerAuth`
   * @decorator `@ApiOperation`
   * @decorator `@ApiParam`
   * @decorator `@ApiBody`
   * @decorator `@ApiOkResponse`
   * @decorator `@ApiNotFoundResponse`
   * @decorator `@ApiBadRequestResponse`
   * @decorator `@ApiUnauthorizedResponse`
   * @decorator `@UseGuards`
   * @decorator `@Patch`
   *
   * @param id - The id of the report to update.
   * @param updateReportDto - The DTO with the data to update the report with.
   *
   * @returns The updated report
   */
  @ApiBearerAuth('jwt')
  @ApiOperation({
    description:
      'Updates the content and/or resolution status of the report with the provided id.',
    summary:
      'Updates the content and/or resoluation status of the report with the provided id.',
  })
  @ApiParam({
    allowEmptyValue: false,
    description: 'The id of the report to update.',
    example: 1,
    name: 'id',
    required: true,
    type: Number,
  })
  @ApiBody({
    description: 'The DTO with the data to update the report with.',
    required: true,
    type: UpdateReportDto,
  })
  @ApiOkResponse({
    description: 'Successfully updated the report with the provided data.',
    type: Report,
  })
  @ApiNotFoundResponse({
    description: 'Could not find the report with the provided id.',
  })
  @ApiBadRequestResponse({
    description: 'The DTO is invalid.',
  })
  @ApiUnauthorizedResponse({
    description: 'Please login before calling this endpoint.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateReportDto: UpdateReportDto
  ): Promise<Report> {
    return this.reportsService.update(+id, updateReportDto);
  }

  /**
   * Removes a report.
   *
   * @decorator `@ApiBearerAuth`
   * @decorator `@ApiOperation`
   * @decorator `@ApiParam`
   * @decorator `@ApiOkResponse`
   * @decorator `@ApiNotFoundResponse`
   * @decorator `@ApiUnauthorizedResponse`
   * @decorator `@UseGuards`
   * @decorator `@Delete`
   *
   * @param id - The id of the report to remove.
   */
  @ApiBearerAuth('jwt')
  @ApiOperation({
    description: 'Removes a report.',
    summary: 'Removes a report.',
  })
  @ApiParam({
    allowEmptyValue: false,
    description: 'The id of the report to remove.',
    example: 1,
    name: 'id',
    required: true,
    type: Number,
  })
  @ApiOkResponse({
    description: 'Successfully removed the report with the provided id.',
    type: Report,
  })
  @ApiNotFoundResponse({
    description: 'Could not find the report with the provided id.',
  })
  @ApiUnauthorizedResponse({
    description: 'Please login before calling this endpoint.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<void> {
    return this.reportsService.remove(+id);
  }
}
