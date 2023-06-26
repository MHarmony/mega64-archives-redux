import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

/**
 * The Users controller.
 *
 * @decorator `@ApiTags`
 * @decorator `@Controller`
 */
@ApiTags('users')
@Controller('users')
export class UsersController {
  /**
   * The constructor for UsersController.
   *
   * @param usersService - The UsersService.
   */
  constructor(private readonly usersService: UsersService) {}

  /**
   * Creates a new user.
   *
   * @decorator `@ApiOperation`
   * @decorator `@ApiBody`
   * @decorator `@ApiCreatedResponse`
   * @decorator `@ApiBadRequestResponse`
   * @decorator `@Post`
   *
   * @param createUserDto - The DTO with the data to create the user with.
   *
   * @returns The newly created user.
   */
  @ApiOperation({
    description: 'Creates a new user.',
    summary: 'Creates a new user.',
  })
  @ApiBody({
    description: 'The DTO with the data to create the user with.',
    required: true,
    type: CreateUserDto,
  })
  @ApiCreatedResponse({
    description: 'Successfully created a new user.',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'The DTO is invalid.',
  })
  @Post()
  public async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  /**
   * Finds all users.
   *
   * @decorator `@ApiBearerAuth`
   * @decorator `@ApiOperation`
   * @decorator `@ApiOkResponse`
   * @decorator `@ApiUnauthorizedResponse`
   * @decorator `@UseGuards`
   * @decorator `@Get`
   *
   * @returns An array of all users.
   */
  @ApiBearerAuth('jwt')
  @ApiOperation({
    description: 'Finds all users.',
    summary: 'Finds all users.',
  })
  @ApiOkResponse({
    description: 'Successfully found all users.',
    type: [User],
  })
  @ApiUnauthorizedResponse({
    description: 'Please login before calling this endpoint.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  public async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  /**
   * Finds a user by their email.
   *
   * @decorator `@ApiOperation`
   * @decorator `@ApiParam`
   * @decorator `@ApiOkResponse`
   * @decorator `@ApiNotFoundResponse`
   * @decorator `@Get`
   *
   * @param email - The email of the user to find.
   *
   * @returns The user with the provided email.
   */
  @ApiOperation({
    description: 'Finds a user by their email.',
    summary: 'Finds a user by their email.',
  })
  @ApiParam({
    allowEmptyValue: false,
    description: 'The email of the user to find.',
    example: 'john.doe@gmail.com',
    name: 'email',
    required: true,
    type: String,
  })
  @ApiOkResponse({
    description: 'Successfully found the user with the provided email.',
    type: User,
  })
  @ApiNotFoundResponse({
    description: 'Could not find the user with the provided email.',
  })
  @Get('/byEmail/:email')
  public async findOneByEmail(@Param('email') email: string): Promise<User> {
    return this.usersService.findOneByEmail(email);
  }

  /**
   * Finds a user by their id.
   *
   * @decorator `@ApiBearerAuth`
   * @decorator `@ApiOperation`
   * @decorator `@ApiParam`
   * @decorator `@ApiOkResponse`
   * @decorator `@ApiNotFoundResponse`
   * @decorator `@ApiUnauthorizedResponse`
   * @decorator `@UseGuards`
   * @decorator `@Get`
   *
   * @param id - The id of the user to find.
   *
   * @returns The user with the provided id.
   */
  @ApiBearerAuth('jwt')
  @ApiOperation({
    description: 'Finds a user by their id.',
    summary: 'Finds a user by their id.',
  })
  @ApiParam({
    allowEmptyValue: false,
    description: 'The id of the user to find.',
    example: 1,
    name: 'id',
    required: true,
    type: Number,
  })
  @ApiOkResponse({
    description: 'Successfully found the user with the provided id.',
    type: User,
  })
  @ApiNotFoundResponse({
    description: 'Could not find the user with the provided id.',
  })
  @ApiUnauthorizedResponse({
    description: 'Please login before calling this endpoint.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('/byId/:id')
  public async findOneById(@Param('id') id: string): Promise<User> {
    return this.usersService.findOneById(+id);
  }

  /**
   * Updates the email and/or name of the user with the provided id.
   *
   * @decorator `@ApiBearerAuth`
   * @decorator `@ApiOperation`
   * @decorator `@ApiParam`
   * @decorator `@ApiBody`
   * @decorator `@ApiOkResponse`
   * @decorator `@ApiNotFoundResponse`
   * @decorator `@ApiBadRequestResponse`
   * @decorator `@ApiUnauthorizedResponse`
   * @decorator `@UseGuards`
   * @decorator `@Patch`
   *
   * @param id - The id of the user to update.
   * @param updateUserDto - The DTO with the data to update the user with.
   *
   * @returns The updated user
   */
  @ApiBearerAuth('jwt')
  @ApiOperation({
    description:
      'Updates the email and/or name of the user with the provided id.',
    summary: 'Updates the email and/or name of the user with the provided id.',
  })
  @ApiParam({
    allowEmptyValue: false,
    description: 'The id of the user to update.',
    example: 1,
    name: 'id',
    required: true,
    type: Number,
  })
  @ApiBody({
    description: 'The DTO with the data to update the user with.',
    required: true,
    type: UpdateUserDto,
  })
  @ApiOkResponse({
    description: 'Successfully updated the user with the provided data.',
    type: User,
  })
  @ApiNotFoundResponse({
    description: 'Could not find the user with the provided id.',
  })
  @ApiBadRequestResponse({
    description: 'The DTO is invalid.',
  })
  @ApiUnauthorizedResponse({
    description: 'Please login before calling this endpoint.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return this.usersService.update(+id, updateUserDto);
  }

  /**
   * Removes a user.
   *
   * @decorator `@ApiBearerAuth`
   * @decorator `@ApiOperation`
   * @decorator `@ApiParam`
   * @decorator `@ApiOkResponse`
   * @decorator `@ApiNotFoundResponse`
   * @decorator `@ApiUnauthorizedResponse`
   * @decorator `@UseGuards`
   * @decorator `@Delete`
   *
   * @param id - The id of the user to remove.
   */
  @ApiBearerAuth('jwt')
  @ApiOperation({
    description: 'Removes a user.',
    summary: 'Removes a user.',
  })
  @ApiParam({
    allowEmptyValue: false,
    description: 'The id of the user to remove.',
    example: 1,
    name: 'id',
    required: true,
    type: Number,
  })
  @ApiOkResponse({
    description: 'Successfully removed the user with the provided id.',
    type: User,
  })
  @ApiNotFoundResponse({
    description: 'Could not find the user with the provided id.',
  })
  @ApiUnauthorizedResponse({
    description: 'Please login before calling this endpoint.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(+id);
  }
}
