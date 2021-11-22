import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PostgresError } from 'pg-error-enum';
import { DatabaseService } from '../database/database.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
import { TagInfo, TagList } from './interfaces/tag.interface';

@Injectable()
export class TagService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(userUid: string, createTagDto: CreateTagDto): Promise<Tag> {
    const tag = new Tag(userUid, createTagDto.name, createTagDto.sortOrder);

    try {
      const { rows } = await this.databaseService.query(
        'INSERT INTO tags (creator, name, sort_order) VALUES ($1, $2, $3) RETURNING id',
        [userUid, tag.name, tag.sortOrder],
      );
      tag.id = rows[0].id;
    } catch (e) {
      if (e.code == PostgresError.UNIQUE_VIOLATION) {
        throw new HttpException('Tag already exists', HttpStatus.CONFLICT);
      } else {
        throw e;
      }
    }

    return tag;
  }

  async findOne(id: number): Promise<TagInfo> {
    const { rows: tagRows } = await this.databaseService.query(
      'SELECT * FROM tags WHERE id = $1',
      [id],
    );
    if (tagRows.length <= 0) {
      return null;
    }
    const tag = tagRows[0];

    const { rows: userRows } = await this.databaseService.query(
      'SELECT * FROM users WHERE uid = $1',
      [tag.creator],
    );
    if (userRows.length <= 0) {
      return null;
    }
    const user = userRows[0];

    return {
      creator: {
        nickname: user.nickname,
        uid: user.uid,
      },
      name: tag.name,
      sortOrder: tag.sort_order,
    };
  }

  async findAll(
    sortByOrder: boolean,
    sortByName: boolean,
    offset: number,
    length: number,
  ): Promise<TagList> {
    let query = 'SELECT * FROM tags';
    const values: any[] = [];

    if (offset > 0) {
      query += ' WHERE id > $1';
      values.push(offset);
    }

    if (sortByOrder) {
      query += ' ORDER BY sort_order';
    }
    if (sortByName) {
      if (sortByOrder) {
        query += ', name';
      } else {
        query += ' ORDER BY name';
      }
    }

    if (length > 0) {
      query += ' LIMIT $' + (offset > 0 ? '2' : '1');
      values.push(length);
    }

    const data: TagInfo[] = [];

    const { rows: tagRows } = await this.databaseService.query(query, values);
    for (const row of tagRows) {
      const { rows: userRows } = await this.databaseService.query(
        'SELECT * FROM users WHERE uid = $1',
        [row.creator],
      );
      const user = userRows[0];

      data.push({
        creator: {
          nickname: user.nickname,
          uid: user.uid,
        },
        name: row.name,
        sortOrder: row.sort_order,
      });
    }

    return {
      data: data,
      meta: {
        offset: offset || 0,
        length: length || 0,
        quantity: tagRows.length,
      },
    };
  }

  async update(userUid: string, id: number, updateTagDto: UpdateTagDto) {
    try {
      const { rowCount } = await this.databaseService.query(
        'UPDATE tags SET name = $1, sort_order = $2 WHERE id = $3 AND creator = $4',
        [updateTagDto.name, updateTagDto.sortOrder, id, userUid],
      );
      if (rowCount <= 0) {
        throw new HttpException(
          'The tag does not exist or you are not its creator',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (e) {
      if (e.code == PostgresError.UNIQUE_VIOLATION) {
        throw new HttpException('Tag already exists', HttpStatus.CONFLICT);
      } else {
        throw e;
      }
    }
  }

  async remove(userUId: string, id: number): Promise<boolean> {
    const { rowCount } = await this.databaseService.query(
      'DELETE FROM tags WHERE id = $1 AND creator = $2',
      [id, userUId],
    );
    if (rowCount <= 0) {
      throw new HttpException(
        'The tag does not exist or you are not its creator',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { rows } = await this.databaseService.query(
      `UPDATE user_tags SET tags = array_remove(tags, $1)`,
      [id],
    );

    return true;
  }
}
