import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, Validate } from 'class-validator';
import { PasswordValidator } from '../password-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'The email of user',
    example: 'admin@example.com',
    maxLength: 100,
  })
  @MaxLength(100)
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of user',
    example: 'Example123',
    maxLength: 100,
  })
  @Validate(PasswordValidator, {
    message:
      'The password must be at least 8 characters long and contain at least one number, one uppercase and one lowercase letter.',
  })
  password: string;

  @ApiProperty({
    description: 'The nickname of user',
    example: 'Admin',
    maxLength: 30,
  })
  @IsNotEmpty()
  @MaxLength(30)
  nickname: string;
}
