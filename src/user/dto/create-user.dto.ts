import { IsEmail, IsNotEmpty, MaxLength, Validate } from 'class-validator';
import { PasswordValidator } from '../password-validator';

export class CreateUserDto {
  @MaxLength(100)
  @IsEmail()
  email: string;

  @Validate(PasswordValidator, {
    message:
      'The password must be at least 8 characters long and contain at least one number, one uppercase and one lowercase letter.',
  })
  password: string;

  @IsNotEmpty()
  @MaxLength(30)
  nickname: string;
}
