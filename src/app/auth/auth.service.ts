import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDto, UserRegisterDto } from '../users/user.dto';
import { UserDocument } from '../users/user.schema';
import { UserService } from '../users/user.service';
import { utils } from 'ethers';
@Injectable()
export class AuthService {
  constructor(private usersService: UserService, private jwtService: JwtService) {}

  private nonceTemplate = 'Welcome to ParaVerse! Click "Sign" to sign in. No password needed! Your nonce: {{nonce}}';

  buildNonceTemplate(nonce: string) {
    return this.nonceTemplate.replace('{{nonce}}', nonce);
  }

  async verifyNonce(nonce: string, signature: string, account: string) {
    const message = this.buildNonceTemplate(nonce);
    const result = utils.verifyMessage(message, signature);
    if (result.toLowerCase() !== account.toLowerCase()) {
      throw new BadRequestException('Invalid signature');
    }
    return result.toLowerCase();
  }

  async login(userLoginDto: UserLoginDto) {
    const user = await this.usersService.findAndValidateUser(userLoginDto);
    return this._createAuthResponse(user);
  }

  async register(userRegisterDto: UserRegisterDto) {
    const user = await this.usersService.createUser(userRegisterDto);
    return this._createAuthResponse(user);
  }

  _createAuthResponse(user: UserDocument) {
    const payload = { email: user.email, sub: user._id };
    const token = this.jwtService.sign(payload);
    return {
      access_token: token,
      user: {
        email: user.email,
        name: user.name,
      },
    };
  }
}
