import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateUser, UpdateUser, User } from '@mega64/common';
import { firstValueFrom } from 'rxjs';

/**
 * The Users service.
 *
 * @decorator `@Injectable`
 */
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  /**
   * The current user.
   */
  public currentUser: User | undefined;

  /**
   * The constructor for UsersService.
   *
   * @param httpClient - The HttpClient.
   */
  public constructor(private readonly httpClient: HttpClient) {}

  /**
   * Creates a new user.
   *
   * @param createUserDto - The DTO with the data to create the user with.
   *
   * @returns The newly created user.
   */
  public async create(createUserDto: CreateUser): Promise<User> {
    return firstValueFrom(
      this.httpClient.post<User>('/api/users', createUserDto),
    );
  }

  /**
   * Finds all users.
   *
   * @returns An array of all users.
   */
  public async findAll(): Promise<User[]> {
    return firstValueFrom(this.httpClient.get<User[]>('/api/users'));
  }

  /**
   * Finds a user by their email.
   *
   * @param email - The email of the user to find.
   *
   * @returns The user with the provided email.
   */
  public async findOneByEmail(email: string): Promise<User> {
    return firstValueFrom(
      this.httpClient.get<User>(`/api/users/byEmail/${email}`),
    );
  }

  /**
   * Finds a user by their id.
   *
   * @param id - The id of the user to find.
   *
   * @returns The user with the provided id.
   */
  public async findOneById(id: number): Promise<User> {
    return firstValueFrom(this.httpClient.get<User>(`/api/users/byId/${id}`));
  }

  /**
   * Get the current user.
   *
   * @returns The current user.
   */
  public getCurrentUser(): User | undefined {
    return this.currentUser;
  }

  /**
   * Updates the email and/or name of the user with the provided id.
   *
   * @param id - The id of the user to update.
   * @param updateUserDto - The DTO with the data to update the user with.
   *
   * @returns The updated user.
   */
  public async update(id: number, updateUserDto: UpdateUser): Promise<User> {
    return firstValueFrom(
      this.httpClient.patch<User>(`/api/users/${id}`, updateUserDto),
    );
  }

  /**
   * Removes a user.
   *
   * @param id - The id of the user to remove.
   */
  public async remove(id: number): Promise<void> {
    return firstValueFrom(this.httpClient.delete<void>(`/api/users/${id}`));
  }

  /**
   * Signs out the current user.
   */
  public signOut(): void {
    this.currentUser = undefined;
  }
}
