import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import entities from '../users/entities/index.entity';
import Migrations from '../database/migrations/index.migration';

export const TypeormConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  return {
    // Using getOrThrow is great for catching missing env vars early
    type: configService.getOrThrow<string>('TYPEORM_CONNECTION') as any,
    host: configService.getOrThrow<string>('TYPEORM_HOST'),
    username: configService.getOrThrow<string>('TYPEORM_USERNAME'),
    password: configService.getOrThrow<string>('TYPEORM_PASSWORD'),
    database: configService.getOrThrow<string>('TYPEORM_DATABASE'),
    port: parseInt(configService.getOrThrow<string>('TYPEORM_PORT')),
    synchronize: false,
    logging: true,
    entities: entities,
    migrations: Migrations,
  };
};

export const TypeormAsynConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: TypeormConfig,
};
