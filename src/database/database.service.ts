import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async query(queryText: string, values: any[] = []) {
    return await this.pool.query(queryText, values);
  }
}
