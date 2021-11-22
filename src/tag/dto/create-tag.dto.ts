import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty()
  @MaxLength(40)
  name: string;

  sortOrder?: number = 0;
}
