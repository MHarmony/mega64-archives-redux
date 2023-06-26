import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

/**
 * The authentication service.
 *
 * @decorator `@Injectable`
 */
@Injectable()
export class AuthService {
  /**
   * The constructor for AuthService.
   *
   * @param jwtService - The JwtService.
   * @param usersService - The UsersService.
   */
  public constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  /**
   * Generates JWT tokens for the provided user.
   *
   * @param user - The user to generate tokens for.
   *
   * @returns The signed JWT token.
   */
  public generateTokens(user: User): { access_token: string } {
    const payload = { sub: user.id, email: user.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Validates the provided user.
   *
   * @param email - The email of the user to validate.
   *
   * @returns The validated user.
   *
   * @throws `UnauthorizedException`
   * This exception is thrown if the user does not exist.
   */
  public async validateUser(email: string): Promise<User> {
    let user: User;

    try {
      user = await this.usersService.findOneByEmail(email);
    } catch {
      throw new UnauthorizedException(
        `The user with email ${email} could not be validated.`
      );
    }

    return user;
  }
}
