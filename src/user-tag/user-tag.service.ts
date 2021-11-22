import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { TagInfo } from '../tag/interfaces/tag.interface';
import { CreateUserTagDto } from './dto/create-user-tag.dto';

@Injectable()
export class UserTagService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(userUid: string, createUserTagDto: CreateUserTagDto) {
    const { rows } = await this.databaseService.query(
      `SELECT * FROM tags WHERE id IN (${createUserTagDto.tags
        .map((_, i) => `($${++i})`)
        .join(', ')})`,
      createUserTagDto.tags,
    );
    if (rows.length != createUserTagDto.tags.length) {
      return false;
    }

    await this.databaseService.query(
      `UPDATE user_tags SET tags = array_cat(tags, $1) WHERE "user" = $2`,
      [createUserTagDto.tags, userUid],
    );

    return this.findAll(userUid);
  }

  async findAll(userUid: string) {
    const { rows: utrows } = await this.databaseService.query(
      'SELECT tags FROM user_tags WHERE "user" = $1',
      [userUid],
    );
    if (utrows.length <= 0) {
      return;
    }

    const tags: TagInfo[] = [];
    for (const tagId of utrows[0].tags) {
      const { rows } = await this.databaseService.query(
        'SELECT * FROM tags WHERE id = $1',
        [tagId],
      );
      const t = rows[0];
      tags.push({
        id: t.id,
        name: t.name,
        sortOrder: t.sort_order,
      });
    }

    return { tags: tags };
  }

  async remove(userUid: string, id: number) {
    const { rows } = await this.databaseService.query(
      `UPDATE user_tags SET tags = array_remove(tags, $1) WHERE "user" = $2`,
      [id, userUid],
    );
    return this.findAll(userUid);
  }
}
