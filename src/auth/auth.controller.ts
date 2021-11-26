import {
  Controller,
  Post,
  Delete,
  Body,
  UseGuards,
  Request,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LocalAuthGuard } from './local-auth.guard';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Registers the user' })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User already exists',
  })
  @ApiCreatedResponse()
  @Post('signin') // Could it be an error in the test task? It must be a signup.
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @ApiOperation({ summary: 'User login' })
  @ApiUnauthorizedResponse()
  @ApiOkResponse()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  auth(@Request() req) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'Update JWT token' })
  @UseGuards(JwtAuthGuard)
  @Post('refresh_token')
  update(@Request() req) {
    // Todo: Use refresh token.
    return this.authService.updateToken(req.user);
  }

  @ApiOperation({ summary: 'User logout' })
  @UseGuards(JwtAuthGuard)
  @Delete('logout')
  remove() {
    // Todo: Add token to black list.
  }
}
