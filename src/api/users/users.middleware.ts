import { Context } from 'koa';
import { Container } from 'typedi';

import { UserService } from './users.service';

export async function emailConfirmCode(ctx: Context, next: () => Promise<any>) {
  const { user } = ctx.state;
  await Container.get(UserService).sendEmailConfirmCode(user);
  await next();
}
