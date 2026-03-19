import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormAsynConfig } from 'src/config/typeorm.config';
import { Student } from './entities/student.entity';
import { Role } from './entities/role.entity';
import { Permissions } from './entities/permission.entity';
import { Lesson } from './entities/lesson.entity';
import { Instructor } from './entities/instructor.entity';
import { Course } from './entities/course.entity';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '@nestjs-modules/ioredis';
import { OtpService } from 'src/otp/otp.service';
import { EmailService } from 'src/email/email.service';
import { ExcelSheet } from './entities/excel.entity';
import { Organization } from './entities/organization.entity';
import { Tutor } from './entities/tutor.entity';
import { Subscription } from './entities/subscription.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync(TypeormAsynConfig),
    TypeOrmModule.forFeature([
      Student,
      Role,
      Permissions,
      Lesson,
      Instructor,
      Course,
      ExcelSheet,
      Organization,
      Tutor,
      Subscription,
    ]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
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
  controllers: [UsersController],
  providers: [UsersService, OtpService, EmailService],
})
export class UsersModule {}
