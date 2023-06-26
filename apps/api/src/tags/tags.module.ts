import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

/**
 * The Tags module.
 *
 * @decorator `@Module`
 */
@Module({
  controllers: [TagsController],
  exports: [TypeOrmModule, TagsService],
  imports: [TypeOrmModule.forFeature([Tag])],
  providers: [TagsService],
})
export class TagsModule {}
