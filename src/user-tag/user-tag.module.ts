import { Module } from '@nestjs/common';
import { UserTagService } from './user-tag.service';
import { UserTagController } from './user-tag.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UserTagController],
  providers: [UserTagService],
  exports: [UserTagService],
})
export class UserTagModule {}
