import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class BookSeatDto {
  @ApiProperty({ example: 1, description: 'Organization ID whose seats to book' })
  @IsNumber()
  @IsPositive()
  organization_id: number;
}
