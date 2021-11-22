import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { PostgresError } from 'pg-error-enum';
import { UserTagService } from '../user-tag/user-tag.service';

@Injectable()
export class UserService {
  constructor(
    private readonly databaseService: DatabaseService,
    @Inject(forwardRef(() => UserTagService))
    private readonly userTagService: UserTagService,
  ) {}

  async getUser(user) {
    return {
      email: user.email,
      nickname: user.nickname,
      tags: (await this.userTagService.findAll(user.uid)).tags,
    };
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = new User(
      await uuidv4(),
      createUserDto.email,
      createUserDto.nickname,
    );
    await user.setPassword(createUserDto.password);

    try {
      await this.databaseService.query(
        'INSERT INTO users (uid, email, password, nickname) VALUES ($1, $2, $3, $4)',
        [user.uid, user.email, user.password, user.nickname],
      );
      await this.databaseService.query(
        'INSERT INTO user_tags ("user") VALUES ($1)',
        [user.uid],
      );
    } catch (e) {
      if (e.code == PostgresError.UNIQUE_VIOLATION) {
        throw new HttpException('User already exists', HttpStatus.CONFLICT);
      } else {
        throw e;
      }
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const { rows } = await this.databaseService.query(
      'SELECT * FROM users WHERE email = $1',
      [email],
    );
    if (rows.length <= 0) {
      return null;
    }
    const user = rows[0];
    return new User(user.uid, user.email, user.nickname, user.password);
  }

  async update(uid: string, updateUserDto: UpdateUserDto) {
    const user = new User(uid, updateUserDto.email, updateUserDto.nickname);
    await user.setPassword(updateUserDto.password);
    try {
      await this.databaseService.query(
        'UPDATE users SET email = $1, nickname = $2, password = $3 WHERE uid = $4;',
        [user.email, user.nickname, user.password, user.uid],
      );
    } catch (e) {
      if (e.code == PostgresError.UNIQUE_VIOLATION) {
        throw new HttpException('User already exists', HttpStatus.CONFLICT);
      } else {
        throw e;
      }
    }
  }

  async remove(uid: string): Promise<boolean> {
    return (
      (
        await this.databaseService.query(
          'DELETE FROM users WHERE uid = $1; DELETE FROM user_tags WHERE "user" = $1',
          [uid],
        )
      ).rowCount > 0
    );
  }
}
