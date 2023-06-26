import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Comment, CreateComment, UpdateComment } from '@mega64/common';
import { firstValueFrom } from 'rxjs';

/**
 * The Comments service.
 *
 * @decorator `@Injectable`
 */
@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  /**
   * The constructor for CommentsService.
   *
   * @param httpClient - The HttpClient.
   */
  public constructor(private readonly httpClient: HttpClient) {}

  /**
   * Creates a new comment.
   *
   * @param createCommentDto - The DTO with the data to create the comment with.
   *
   * @returns The newly created comment.
   */
  public async create(createCommentDto: CreateComment): Promise<Comment> {
    return firstValueFrom(
      this.httpClient.post<Comment>('/api/comments', createCommentDto)
    );
  }

  /**
   * Finds all comments.
   *
   * @returns An array of all comments.
   */
  public async findAll(): Promise<Comment[]> {
    return firstValueFrom(this.httpClient.get<Comment[]>('/api/comments'));
  }

  /**
   * Finds a comment by its content.
   *
   * @param content - The content of the comment to find.
   *
   * @returns The comment with the provided content.
   */
  public async findOneByContent(content: string): Promise<Comment> {
    return firstValueFrom(
      this.httpClient.get<Comment>(`/api/comments/byContent/${content}`)
    );
  }

  /**
   * Finds a comment by its id.
   *
   * @param id - The id of the comment to find.
   *
   * @returns The comment with the provided id.
   */
  public async findOneById(id: number): Promise<Comment> {
    return firstValueFrom(
      this.httpClient.get<Comment>(`/api/comments/byId/${id}`)
    );
  }

  /**
   * Updates the content of the comment with the provided id.
   *
   * @param id - The id of the comment to update.
   * @param updateTag - The DTO with the data to update the comment with.
   *
   * @returns The updated comment.
   */
  public async update(
    id: number,
    updateCommentDto: UpdateComment
  ): Promise<Comment> {
    return firstValueFrom(
      this.httpClient.patch<Comment>(`/api/comments/${id}`, updateCommentDto)
    );
  }

  /**
   * Removes a comment.
   *
   * @param id - The id of the comment to remove.
   */
  public async remove(id: number): Promise<void> {
    return firstValueFrom(this.httpClient.delete<void>(`/api/comments/${id}`));
  }
}
