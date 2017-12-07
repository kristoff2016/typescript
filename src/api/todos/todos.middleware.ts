import { Context } from 'koa';

export async function validateCreateTodo(ctx: Context, next: () => Promise<any>) {
  await ctx.validate({
    title: 'required|string',
    status: 'required|string|in:complete,incomplete'
  });
  await next();
}

export function emitCreateTodo(ctx: Context) {
  global.io.emit('[Todos] Create', ctx.state.todo);
}
