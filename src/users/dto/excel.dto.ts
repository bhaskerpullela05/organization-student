import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class ExcelSheet {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  course_name: string;

  @IsBoolean()
  @IsOptional()
  is_active: boolean;
}
