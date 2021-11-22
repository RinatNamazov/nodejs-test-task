import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
  DefaultValuePipe,
  Req,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() createTagDto: CreateTagDto) {
    const { creator, ...result } = await this.tagService.create(
      req.user.uid,
      createTagDto,
    );
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query('sortByOrder') sortByOrder: boolean,
    @Query('sortByName') sortByName: boolean,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('length', new DefaultValuePipe(0), ParseIntPipe) length: number,
  ) {
    sortByOrder = sortByOrder != undefined && sortByOrder != false;
    sortByName = sortByName != undefined && sortByName != false;
    return this.tagService.findAll(sortByOrder, sortByName, offset, length);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    return this.tagService.update(req.user.uid, id, updateTagDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.tagService.remove(req.user.uid, id);
  }
}
