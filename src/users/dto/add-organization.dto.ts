import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsString,
  MAX_LENGTH,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AddOrganizationDto {
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

  @ApiProperty()
  @IsInt()
  max_limit: number;
}
