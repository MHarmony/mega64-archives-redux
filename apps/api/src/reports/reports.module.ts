import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

/**
 * The Reports module.
 *
 * @decorator `@Module`
 */
@Module({
  controllers: [ReportsController],
  exports: [TypeOrmModule, ReportsService],
  imports: [TypeOrmModule.forFeature([Report])],
  providers: [ReportsService],
})
export class ReportsModule {}
