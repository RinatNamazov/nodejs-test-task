import * as bcrypt from 'bcrypt';
import { saltRounds } from '../user.constants';

export class User {
  constructor(
    public uid: string, // UUID
    public email: string,
    public nickname: string,
    public password?: string, // Hash
  ) {}

  async setPassword(password: string): Promise<void> {
    this.password = await bcrypt.hash(password, saltRounds);
  }

  async checkPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
