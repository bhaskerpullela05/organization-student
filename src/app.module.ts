import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules/ioredis';
import { SeatsModule } from './seats/seats.module';

@Module({
  imports: [
    UsersModule,
    SeatsModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: parseInt(config.getOrThrow<string>('JWT_EXPIRES_IN')),
        },
      }),
    }),
    RedisModule.forRoot({
      type: 'single',
      url: 'redis://localhost:6379',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
