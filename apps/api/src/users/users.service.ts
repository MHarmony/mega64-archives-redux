import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

/**
 * The service for interacting with {@link User} entities.
 *
 * @decorator `@Injectable`
 */
@Injectable()
export class UsersService {
  /**
   * The constructor for UsersService.
   *
   * @param usersRepository - The UsersRepository.
   */
  public constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>
  ) {}

  /**
   * Creates a new user.
   *
   * @param createUserDto - The DTO with the data to create the user with.
   *
   * @returns The newly created user.
   */
  public async create(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.save(createUserDto);
  }

  /**
   * Finds all users.
   *
   * @returns An array of all users.
   */
  public async findAll(): Promise<User[]> {
    return this.usersRepository.find({ order: { updatedAt: 'DESC' } });
  }

  /**
   * Finds a user by their email.
   *
   * @param email - The email of the user to find.
   *
   * @returns The user with the provided email.
   *
   * @throws `NotFoundException`
   * This exception is thrown if the user with the provided email does not exist.
   */
  public async findOneByEmail(email: string): Promise<User> {
    const foundUser = await this.usersRepository.findOneBy({ email });

    if (!foundUser) {
      throw new NotFoundException(
        `The user with email ${email} was not found.`
      );
    }

    return foundUser;
  }

  /**
   * Finds a user by their id.
   *
   * @param id - The id of the user to find.
   *
   * @returns The user with the provided id.
   *
   * @throws `NotFoundException`
   * This exception is thrown if the user with the provided id does not exist.
   */
  public async findOneById(id: number): Promise<User> {
    const foundUser = await this.usersRepository.findOneBy({ id });

    if (!foundUser) {
      throw new NotFoundException(`The user with id ${id} was not found.`);
    }

    return foundUser;
  }

  /**
   * Updates the email and/or name of the user with the provided id.
   *
   * @param id - The id of the user to update.
   * @param updateUserDto - The DTO with the data to update the user with.
   *
   * @returns The updated user
   */
  public async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const foundUser = await this.findOneById(id);

    if (updateUserDto.email) {
      foundUser.email = updateUserDto.email;
    }
    if (updateUserDto.name) {
      foundUser.name = updateUserDto.name;
    }

    return this.usersRepository.save(foundUser);
  }

  /**
   * Removes a user.
   *
   * @param id - The id of the user to remove.
   */
  public async remove(id: number): Promise<void> {
    const foundUser = await this.findOneById(id);

    await this.usersRepository.remove(foundUser);
  }
}
