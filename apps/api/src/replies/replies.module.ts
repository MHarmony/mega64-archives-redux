import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reply } from './entities/reply.entity';
import { RepliesController } from './replies.controller';
import { RepliesService } from './replies.service';

/**
 * The Replies module.
 *
 * @decorator `@Module`
 */
@Module({
  controllers: [RepliesController],
  exports: [TypeOrmModule, RepliesService],
  imports: [TypeOrmModule.forFeature([Reply])],
  providers: [RepliesService],
})
export class RepliesModule {}
