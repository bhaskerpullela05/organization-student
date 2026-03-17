import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import entities from '../users/entities/index.entity';
import { DataSource } from 'typeorm';
import Migrations from '../database/migrations/index.migration';

async function getDataSource(): Promise<DataSource> {
  const app = await NestFactory.createApplicationContext(
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
  );

  const configService = app.get(ConfigService);

  return new DataSource({
    type: configService.getOrThrow<string>('TYPEORM_CONNECTION') as any,
    host: configService.getOrThrow<string>('TYPEORM_HOST'),
    database: configService.getOrThrow<string>('TYPEORM_DATABASE'),
    username: configService.getOrThrow<string>('TYPEORM_USERNAME'),
    password: configService.getOrThrow<string>('TYPEORM_PASSWORD'),
    port: parseInt(configService.getOrThrow<string>('TYPEORM_PORT')),
    synchronize: false,
    logging: true,
    entities: entities,
    migrations: Migrations,
  });
}

const datasource = getDataSource();
export default datasource;
