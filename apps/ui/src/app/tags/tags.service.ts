import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateTag, Tag, UpdateTag } from '@mega64/common';
import { firstValueFrom } from 'rxjs';

/**
 * The Tags service.
 *
 * @decorator `@Injectable`
 */
@Injectable({
  providedIn: 'root',
})
export class TagsService {
  /**
   * The constructor for TagsService.
   *
   * @param httpClient - The HttpClient.
   */
  public constructor(private readonly httpClient: HttpClient) {}

  /**
   * Creates a new tag.
   *
   * @param createTagDTO - The DTO with the data to create the tag with.
   *
   * @returns The newly created tag.
   */
  public async create(createTagDto: CreateTag): Promise<Tag> {
    return firstValueFrom(this.httpClient.post<Tag>('/api/tags', createTagDto));
  }

  /**
   * Finds all tags.
   *
   * @returns An array of all tags.
   */
  public async findAll(): Promise<Tag[]> {
    return firstValueFrom(this.httpClient.get<Tag[]>('/api/tags'));
  }

  /**
   * Finds a tag by its content.
   *
   * @param content - The content of the tag to find.
   *
   * @returns The tag with the provided content.
   */
  public async findOneByContent(content: string): Promise<Tag> {
    return firstValueFrom(
      this.httpClient.get<Tag>(`/api/tags/byContent/${content}`)
    );
  }

  /**
   * Finds a tag by its id.
   *
   * @param id - The id of the tag to find.
   *
   * @returns The tag with the provided id.
   */
  public async findOneById(id: number): Promise<Tag> {
    return firstValueFrom(this.httpClient.get<Tag>(`/api/tags/byId/${id}`));
  }

  /**
   * Updates the content of the tag with the provided id.
   *
   * @param id - The id of the tag to update.
   * @param updateTag - The DTO with the data to update the tag with.
   *
   * @returns The updated tag.
   */
  public async update(id: number, updateTagDto: UpdateTag): Promise<Tag> {
    return firstValueFrom(
      this.httpClient.patch<Tag>(`/api/tags/${id}`, updateTagDto)
    );
  }

  /**
   * Removes a tag.
   *
   * @param id - The id of the tag to remove.
   */
  public async remove(id: number): Promise<void> {
    return firstValueFrom(this.httpClient.delete<void>(`/api/tags/${id}`));
  }
}
