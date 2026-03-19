import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsDateString, IsIn } from 'class-validator';

export class SubscriptionDto {
  @ApiProperty()
  @IsString()
  plane_name: string;

  @ApiProperty()
  @IsInt()
  max_users: number;
}
