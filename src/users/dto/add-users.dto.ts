import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsInt,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AddUserDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @MaxLength(10)
  password: string;
}
