import { ApiProperty } from '@nestjs/swagger';

export class CreateUserTagDto {
  @ApiProperty({ description: 'Tag list', example: '[1, 2]', isArray: true })
  tags: number[];
}
