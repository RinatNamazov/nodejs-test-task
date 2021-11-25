import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({ description: 'Tag name', example: 'Rust', maxLength: 40 })
  @IsNotEmpty()
  @MaxLength(40)
  name: string;

  @ApiProperty({ description: 'Sort order', example: 0 })
  sortOrder?: number = 0;
}
