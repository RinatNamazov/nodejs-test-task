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
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('user/tag')
@Controller('user/tag')
export class UserTagController {
  constructor(private readonly userTagService: UserTagService) {}

  @ApiOperation({ summary: 'Add a tag to the current user' })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createUserTagDto: CreateUserTagDto) {
    return this.userTagService.create(req.user.uid, createUserTagDto);
  }

  @ApiOperation({ summary: 'Get a list of all tags by the current user' })
  @UseGuards(JwtAuthGuard)
  @Get('my')
  findAll(@Request() req) {
    return this.userTagService.findAll(req.user.uid);
  }

  @ApiOperation({ summary: 'Delete a tag from a current user' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.userTagService.remove(req.user.uid, id);
  }
}
