import { uuid } from '@common/utils/string';
import { Body, Controller, Get, Post, Redirect, Render, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserLoginDto, UserLoginWalletDto, UserRegisterDto } from '../users/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/login')
  @Render('login')
  async renderLogin() {
    return {
      title: 'Login',
    };
  }

  @Get('/logout')
  @Redirect('/')
  async logout(@Req() req: Request, @Res({ passthrough: true }) response: Response) {
    req.session.destroy(() => null);
    response.clearCookie('access_token');
  }

  @Post('/login')
  async login(@Body() userLoginDto: UserLoginDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.login(userLoginDto);
    response.cookie('access_token', result.access_token, { httpOnly: true });
    return result;
  }

  @Get('/login-with-wallet')
  @Render('login-with-wallet')
  async renderLoginWithWallet(@Req() req: Request) {
    const nonce = uuid();
    req.session.nonce = nonce;
    const nonceTemplate = this.authService.buildNonceTemplate(nonce);
    return {
      title: 'Login with Wallet',
      nonce: nonceTemplate,
    };
  }

  @Post('/login-with-wallet')
  async loginWithWallet(
    @Req() req: Request,
    @Body() userLoginWalletDto: UserLoginWalletDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const address = await this.authService.verifyNonce(
      req.session.nonce,
      userLoginWalletDto.signature,
      userLoginWalletDto.account,
    );
    req.session.nonce = null;
    req.session.address = address;
  }

  @Get('/register')
  @Render('register')
  async renderRegister() {
    return {
      title: 'Register',
    };
  }

  @Post('/register')
  async register(@Body() userRegisterDto: UserRegisterDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.register(userRegisterDto);
    response.cookie('access_token', result.access_token, { httpOnly: true });
    return result;
  }
}
