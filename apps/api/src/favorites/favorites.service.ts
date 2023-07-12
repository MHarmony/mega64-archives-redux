import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { Favorite } from './entities/favorite.entity';

/**
 * The service for interacting with {@link Favorite} entities.
 *
 * @decorator `@Injectable`
 */
@Injectable()
export class FavoritesService {
  /**
   * The constructor for FavoritesService.
   *
   * @param favoritesRepository - The FavoritesRepository.
   */
  public constructor(
    @InjectRepository(Favorite)
    private readonly favoritesRepository: Repository<Favorite>,
  ) {}

  /**
   * Creates a new favorite.
   *
   * @param createFavoriteDto - The DTO with the data to create the favorite with.
   *
   * @returns The newly created favorite.
   */
  public async create(createFavoriteDto: CreateFavoriteDto): Promise<Favorite> {
    return this.favoritesRepository.save(createFavoriteDto);
  }

  /**
   * Finds all favorites.
   *
   * @returns An array of all favorites.
   */
  public async findAll(): Promise<Favorite[]> {
    return this.favoritesRepository.find({ order: { updatedAt: 'DESC' } });
  }

  /**
   * Finds a favorite by its id.
   *
   * @param id - The id of the favorite to find.
   *
   * @returns The favorite with the provided id.
   *
   * @throws `NotFoundException`
   * This exception is thrown if the favorite with the provided id does not exist.
   */
  public async findOneById(id: number): Promise<Favorite> {
    const foundFavorite = await this.favoritesRepository.findOneBy({ id });

    if (!foundFavorite) {
      throw new NotFoundException(`The favorite with id ${id} was not found.`);
    }

    return foundFavorite;
  }

  /**
   * Removes a favorite.
   *
   * @param id - The id of the favorite to remove.
   */
  public async remove(id: number): Promise<void> {
    const foundFavorite = await this.findOneById(id);

    await this.favoritesRepository.remove(foundFavorite);
  }
}
