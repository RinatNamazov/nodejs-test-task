import {
  Controller,
  Post,
  Delete,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Could it be an error in the test task? It must be a signup.
  @Post('signin')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  auth(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh_token')
  update(@Request() req) {
    // Todo: Use refresh token.
    return this.authService.updateToken(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('logout')
  remove() {
    // Todo: Add token to black list.
  }
}
