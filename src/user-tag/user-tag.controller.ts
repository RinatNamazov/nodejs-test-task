import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { UserTagService } from './user-tag.service';
import { CreateUserTagDto } from './dto/create-user-tag.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user/tag')
export class UserTagController {
  constructor(private readonly userTagService: UserTagService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createUserTagDto: CreateUserTagDto) {
    return this.userTagService.create(req.user.uid, createUserTagDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  findAll(@Request() req) {
    return this.userTagService.findAll(req.user.uid);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.userTagService.remove(req.user.uid, id);
  }
}
