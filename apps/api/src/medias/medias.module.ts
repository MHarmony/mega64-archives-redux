import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { MediasController } from './medias.controller';
import { MediasService } from './medias.service';

/**
 * The Medias module.
 *
 * @decorator `@Module`
 */
@Module({
  controllers: [MediasController],
  exports: [TypeOrmModule, MediasService],
  imports: [TypeOrmModule.forFeature([Media])],
  providers: [MediasService],
})
export class MediasModule {}
