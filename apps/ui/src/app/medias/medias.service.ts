import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Media, UpdateMedia } from '@mega64/common';
import { firstValueFrom } from 'rxjs';

/**
 * The Medias service.
 *
 * @decorator `@Injectable`
 */
@Injectable({
  providedIn: 'root',
})
export class MediasService {
  /**
   * The constructor for MediasService.
   *
   * @param httpClient - The HttpClient.
   */
  public constructor(private readonly httpClient: HttpClient) {}

  /**
   * Finds all medias.
   *
   * @returns An array of all medias.
   */
  public async findAll(): Promise<Media[]> {
    return firstValueFrom(this.httpClient.get<Media[]>('/api/medias'));
  }

  /**
   * Finds a media by its id.
   *
   * @param id - The id of the media to find.
   *
   * @returns The media with the provided id.
   */
  public async findOneById(id: number): Promise<Comment> {
    return firstValueFrom(
      this.httpClient.get<Comment>(`/api/medias/byId/${id}`),
    );
  }

  /**
   * Finds a media by its title.
   *
   * @param title - The title of the media to find.
   *
   * @returns The media with the provided title.
   */
  public async findOneByTitle(title: string): Promise<Comment> {
    return firstValueFrom(
      this.httpClient.get<Comment>(`/api/medias/byTitle/${title}`),
    );
  }

  /**
   * Updates the title, description, or link of a media with the provided id.
   *
   * @param id - The id of the media to update.
   * @param updateMediaDto - The DTO with the data to update the media with.
   *
   * @returns The updated media.
   */
  public async update(id: number, updateMediaDto: UpdateMedia): Promise<Media> {
    return firstValueFrom(
      this.httpClient.patch<Media>(`/api/medias/${id}`, updateMediaDto),
    );
  }

  /**
   * Removes a media.
   *
   * @param id - The id of the media to remove.
   */
  public async remove(id: number): Promise<void> {
    return firstValueFrom(this.httpClient.delete<void>(`/api/medias/${id}`));
  }
}
