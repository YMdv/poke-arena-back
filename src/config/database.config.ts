import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Pokemon } from '../pokemon/entities/pokemon.entity';

/**
 * Database Configuration
 *
 * Configuração do TypeORM para conexão com PostgreSQL.
 * Suporta migrations e logging configuráveis via variáveis de ambiente.
 */

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST', 'localhost'),
  port: configService.get<number>('DATABASE_PORT', 5432),
  username: configService.get<string>('DATABASE_USER', 'postgres'),
  password: configService.get<string>('DATABASE_PASSWORD', 'postgres'),
  database: configService.get<string>('DATABASE_NAME', 'pokearena_db'),
  entities: [Pokemon],
  synchronize: configService.get<boolean>('DATABASE_SYNC', false),
  logging: configService.get<boolean>('DATABASE_LOGGING', true),
  migrations: ['dist/database/migrations/**/*.js'],
  migrationsTableName: 'migrations',
});

// DataSource para migrations (CLI)
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'pokearena_db',
  entities: ['src/**/*.entity.ts'],
  migrations: ['database/migrations/**/*.ts'],
  migrationsTableName: 'migrations',
};

export const AppDataSource = new DataSource(dataSourceOptions);
