import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateReply, Reply, UpdateReply } from '@mega64/common';
import { firstValueFrom } from 'rxjs';

/**
 * The Replies service.
 *
 * @decorator `@Injectable`
 */
@Injectable({
  providedIn: 'root',
})
export class RepliesService {
  /**
   * The constructor for RepliesService.
   *
   * @param httpClient - The HttpClient.
   */
  public constructor(private readonly httpClient: HttpClient) {}

  /**
   * Creates a new reply.
   *
   * @param createReplyDto - The DTO with the data to create the reply with.
   *
   * @returns The newly created reply.
   */
  public async create(createReplyDto: CreateReply): Promise<Reply> {
    return firstValueFrom(
      this.httpClient.post<Reply>('/api/replies', createReplyDto)
    );
  }

  /**
   * Finds all replies.
   *
   * @returns An array of all replies.
   */
  public async findAll(): Promise<Reply[]> {
    return firstValueFrom(this.httpClient.get<Reply[]>('/api/replies'));
  }

  /**
   * Finds a reply by its content.
   *
   * @param content - The content of the reply to find.
   *
   * @returns The reply with the provided content.
   */
  public async findOneByContent(content: string): Promise<Reply> {
    return firstValueFrom(
      this.httpClient.get<Reply>(`/api/replies/byContent/${content}`)
    );
  }

  /**
   * Finds a reply by its id.
   *
   * @param id - The id of the reply to find.
   *
   * @returns The reply with the provided id.
   */
  public async findOneById(id: number): Promise<Reply> {
    return firstValueFrom(
      this.httpClient.get<Reply>(`/api/replies/byId/${id}`)
    );
  }

  /**
   * Updates the content of the reply with the provided id.
   *
   * @param id - The id of the reply to update.
   * @param updateTag - The DTO with the data to update the reply with.
   *
   * @returns The updated reply.
   */
  public async update(id: number, updateReplyDto: UpdateReply): Promise<Reply> {
    return firstValueFrom(
      this.httpClient.patch<Reply>(`/api/replies/${id}`, updateReplyDto)
    );
  }

  /**
   * Removes a reply.
   *
   * @param id - The id of the reply to remove.
   */
  public async remove(id: number): Promise<void> {
    return firstValueFrom(this.httpClient.delete<void>(`/api/replies/${id}`));
  }
}
