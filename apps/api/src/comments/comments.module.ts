import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';

/**
 * The Comments module.
 *
 * @decorator `@Module`
 */
@Module({
  controllers: [CommentsController],
  exports: [TypeOrmModule, CommentsService],
  imports: [TypeOrmModule.forFeature([Comment])],
  providers: [CommentsService],
})
export class CommentsModule {}
