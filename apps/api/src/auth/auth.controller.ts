import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { PasswordlessLoginDto } from './dto/passwordless-login.dto';
import { MagicLoginStrategy } from './strategies/magic-login.strategy';

/**
 * The Auth controller.
 *
 * @decorator `@ApiTags`
 * @decorator `@Controller`
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  /**
   * The constructor for AuthController.
   *
   * @param authService - The AuthService.
   * @param strategy - The MagicLoginStrategy.
   */
  constructor(
    private readonly authService: AuthService,
    private strategy: MagicLoginStrategy
  ) {}

  /**
   * Sends a magic link the the provided email.
   *
   * @decorator `@ApiOperation`
   * @decorator `@ApiBody`
   * @decorator `@ApiOkResponse`
   * @decorator `@ApiNotFoundResponse`
   * @decorator `@ApiBadRequestResponse`
   * @decorator `@Post`
   *
   * @param req - The request object.
   * @param res - The response object.
   * @param passwordlessLoginDto - The DTO containing the email to send the magic link to.
   */
  @ApiOperation({
    description: 'Sends a magic link to the provided email.',
    summary: 'Sends a magic link to the provided email.',
  })
  @ApiBody({
    description: 'The DTO with the data to send the magic link to.',
    required: true,
    type: PasswordlessLoginDto,
  })
  @ApiOkResponse({
    description: 'Successfully sent the magic link to the provided email.',
  })
  @ApiNotFoundResponse({
    description: 'A user does not exist with the provided email.',
  })
  @ApiBadRequestResponse({
    description: 'The DTO is invalid.',
  })
  @Post('login')
  public async login(
    @Req() req: Request,
    @Res() res: Response,
    @Body() passwordlessLoginDto: PasswordlessLoginDto
  ): Promise<void> {
    await this.authService.validateUser(passwordlessLoginDto.destination);

    return this.strategy.send(req, res);
  }

  /**
   * Generates the JWT tokens on callback from the magic link email.
   *
   * @decorator `@ApiOperation`
   * @decorator `@ApiOkResponse`
   * @decorator `@ApiUnauthorizedResponse`
   * @decorator `@UseGuards`
   * @decorator `@Get`
   *
   * @param req - The request object.
   *
   * @returns The signed JWT token.
   */
  @ApiOperation({
    description:
      'Generates the JWT tokens on callback from the magic link email.',
    summary: 'Generates the JWT tokens on callback from the magic link email.',
  })
  @ApiOkResponse({
    description: 'Successfully generated the JWT tokens.',
    type: Object,
  })
  @ApiUnauthorizedResponse({
    description: 'Please login before calling this endpoint.',
  })
  @UseGuards(AuthGuard('magiclogin'))
  @Get('login/callback')
  public async callback(
    @Req() req: Request
  ): Promise<{ access_token: string }> {
    return this.authService.generateTokens(req.user as User);
  }
}
