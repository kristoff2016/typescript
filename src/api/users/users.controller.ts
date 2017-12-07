import { Context } from 'koa';
import {
  BadRequestError,
  Body,
  Controller,
  Ctx,
  Get,
  Post,
  QueryParam,
  UseAfter,
  UseBefore
} from 'routing-controllers';

import { LoginRequest } from '../auth/auth.interfaces';
import { validateLogin } from '../auth/auth.middleware';
import { AuthService } from '../auth/auth.service';
import { emailConfirmCode } from './users.middleware';
import { UserService } from './users.service';

@Controller('/users')
export class UserController {
  constructor(private userService: UserService, private authService: AuthService) {}

  @Get('/confirm/email')
  async confirmEmail(
    @QueryParam('code', { required: true, validate: true })
    code: number
  ) {
    console.log(code);
    await this.userService.confirmEmail(code);
    return { message: 'success' };
  }

  @Post('/confirm/code')
  @UseBefore(validateLogin)
  @UseAfter(emailConfirmCode)
  async requestConfirmEmailCode(@Body() body: LoginRequest, @Ctx() ctx: Context) {
    const { email, password } = body;
    const user = await this.userService.findUserByEmail(email);
    await this.authService.comparePassword(password, user.password);
    if (user.verified) throw new BadRequestError('User is already verified.');
    ctx.state.user = user;
    return { message: 'success' };
  }
}
