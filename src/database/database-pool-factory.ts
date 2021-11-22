import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

export const databasePoolFactory = async (configService: ConfigService) => {
  return new Pool({
    host: configService.get('POSTGRES_HOST'),
    port: configService.get('POSTGRES_PORT'),
    user: configService.get('POSTGRES_USER'),
    password: configService.get('POSTGRES_PASSWORD'),
    database: configService.get('POSTGRES_DB'),
  });
};
