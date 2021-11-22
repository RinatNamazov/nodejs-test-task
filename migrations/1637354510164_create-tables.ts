/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('users', {
    uid: { type: 'uuid', primaryKey: true },
    email: { type: 'varchar(100)', notNull: true, unique: true },
    password: { type: 'varchar(100)', notNull: true },
    nickname: { type: 'varchar(30)', notNull: true, unique: true },
  });

  pgm.createTable('tags', {
    id: { type: 'serial', primaryKey: true },
    creator: { type: 'uuid', notNull: true },
    name: { type: 'varchar(40)', notNull: true },
    sort_order: { type: 'int', default: 0 },
  });

  pgm.createTable('user_tags', {
    user: { type: 'uuid', notNull: true },
    tags: { type: 'int[]' },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('users');
  pgm.dropTable('tags');
  pgm.dropTable('user_tags');
}
