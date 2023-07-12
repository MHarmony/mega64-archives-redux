import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateFavorite, Favorite } from '@mega64/common';
import { firstValueFrom } from 'rxjs';

/**
 * The Favorites service.
 *
 * @decorator `@Injectable`
 */
@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  /**
   * The constructor for FavoritesService.
   *
   * @param httpClient - The HttpClient.
   */
  public constructor(private readonly httpClient: HttpClient) {}

  /**
   * Creates a new favorite.
   *
   * @param createFavoriteDto - The DTO with the data to create the favorite with.
   *
   * @returns The newly created favorite.
   */
  public async create(createFavoriteDto: CreateFavorite): Promise<Comment> {
    return firstValueFrom(
      this.httpClient.post<Comment>('/api/favorites', createFavoriteDto),
    );
  }

  /**
   * Finds all favorites.
   *
   * @returns An array of all favorites.
   */
  public async findAll(): Promise<Favorite[]> {
    return firstValueFrom(this.httpClient.get<Favorite[]>('/api/favorites'));
  }

  /**
   * Finds a favorite by its id.
   *
   * @param id - The id of the favorite to find.
   *
   * @returns The favorite with the provided id.
   */
  public async findOneById(id: number): Promise<Comment> {
    return firstValueFrom(
      this.httpClient.get<Comment>(`/api/favorites/byId/${id}`),
    );
  }

  /**
   * Removes a favorite.
   *
   * @param id - The id of the favorite to remove.
   */
  public async remove(id: number): Promise<void> {
    return firstValueFrom(this.httpClient.delete<void>(`/api/favorites/${id}`));
  }
}
