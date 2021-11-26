import {
  Controller,
  Get,
  Body,
  Put,
  Delete,
  UseGuards,
  Request,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get current user information' })
  @UseGuards(JwtAuthGuard)
  @Get()
  getCurrent(@Request() req) {
    return this.userService.getUser(req.user);
  }

  @ApiOperation({ summary: 'Change current user information' })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email or nickname already used by someone',
  })
  @UseGuards(JwtAuthGuard)
  @Put()
  update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    this.userService.update(req.user.uid, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete current user' })
  @UseGuards(JwtAuthGuard)
  @Delete()
  remove(@Request() req) {
    this.userService.remove(req.user.uid);
  }
}
