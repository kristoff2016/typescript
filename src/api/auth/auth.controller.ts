import { Context } from 'koa';
import * as moment from 'moment';
import { BadRequestError, Body, Controller, Ctx, HeaderParam, Post, UseBefore } from 'routing-controllers';

import { sendEmailResetPassword } from '../../lib/mailer';
import { UserService } from '../users/users.service';
import { LoginRequest, RegisterRequest, ResetPasswordCodeRequest, ResetPasswordRequest } from './auth.interfaces';
import { validateLogin, validateRegister, validateRequestCode, validateResetPassword } from './auth.middleware';
import { AuthService } from './auth.service';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UserService) {}

  @Post('/register')
  @UseBefore(validateRegister) // @UseAfter(emailConfirmCode)
  async register(
    @Body() body: RegisterRequest,
    @HeaderParam('X-Device-Name') deviceName: string,
    @HeaderParam('X-UDID') udid: string,
    @HeaderParam('X-Platform') platform: string,
    @HeaderParam('X-Mac') mac: string,
    @HeaderParam('X-OS-Version') osVersion: string,
    @Ctx() ctx: Context
  ) {
    const device = {
      name: deviceName,
      udid,
      platform,
      mac,
      osVersion
    };

    const user = await this.userService.createUserWithDevice({ ...body, ...device });

    ctx.state.user = user;

    return { message: 'success' };
  }

  @Post('/login')
  @UseBefore(validateLogin)
  async login(@Body() body: LoginRequest) {
    const { email, password } = body;
    const user = await this.userService.findUserByEmail(email);
    await this.authService.comparePassword(password, user.password);
    if (!user.verified) throw new BadRequestError('User is not yet verified.');
    const jwt = await this.authService.signJWT({ uid: user.uid }, { expiresIn: '1 day' });
    return { token: jwt };
  }

  @Post('/login/facebook')
  async loginFacebook() {
    return 'login facebook';
  }

  @Post('/requestcode')
  @UseBefore(validateRequestCode)
  async requestCode(@Body() body: ResetPasswordCodeRequest, @Ctx() ctx: Context) {
    const { email } = body;
    const code = Math.floor(100000 + Math.random() * 900000);
    const user = await this.userService.findUserByEmail(email);

    await this.userService.createResetPasswordCode({
      code: code,
      userId: user.id,
      expireAt: moment().add('5', 'minutes').toISOString(),
      type: 'reset_password'
    });

    sendEmailResetPassword(code, user.email);
    return { message: 'We sent you an email. Please check your email to get reset password code' };
  }

  @Post('/resetpassword')
  @UseBefore(validateResetPassword)
  async resetPassword(@Body() body: ResetPasswordRequest, @Ctx() ctx: Context) {
    const { code, password } = body;
    await this.userService.UpdateUserPasswordByCode(code, password);
    return { message: 'Your account password have been updated!' };
  }
}
