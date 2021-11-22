import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { jwtConstants } from './auth.constants';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await user.checkPassword(password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async createUser(createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    return this.login(user);
  }

  async login(user: User) {
    const payload = {
      uid: user.uid,
      email: user.email,
      nickname: user.nickname,
    };
    return {
      token: this.jwtService.sign(payload),
      expire: jwtConstants.expireSeconds,
    };
  }

  async updateToken(user: any) {
    return {
      token: this.jwtService.sign(user),
      expire: jwtConstants.expireSeconds,
    };
  }
}
