import { Controller, Get, HttpStatus, Redirect } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Redirect to the github repository' })
  @ApiResponse({ status: HttpStatus.PERMANENT_REDIRECT })
  @Get()
  @Redirect(
    'https://github.com/RinatNamazov/nodejs-test-task',
    HttpStatus.PERMANENT_REDIRECT,
  )
  index() {}
}
