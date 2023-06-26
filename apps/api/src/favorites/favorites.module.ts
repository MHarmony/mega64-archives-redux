import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';

/**
 * The Favorites module.
 *
 * @decorator `@Module`
 */
@Module({
  controllers: [FavoritesController],
  exports: [TypeOrmModule, FavoritesService],
  imports: [TypeOrmModule.forFeature([Favorite])],
  providers: [FavoritesService],
})
export class FavoritesModule {}
