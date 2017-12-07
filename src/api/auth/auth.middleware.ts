import { Context } from 'koa';

export async function validateRegister(ctx: Context, next: () => Promise<any>) {
  await ctx.validate({
    email: 'required|string|email|unique_email|max:255',
    password: 'required|string|min:6',
    weight: 'required|integer',
    height: 'required|integer',
    gender: 'required|in:male,female',
    genderPref: 'required|in:male,female,both',
    ethnicityId: 'required|ethnicity_exists',
    countryCode: 'required|country_exists'
  });
  await next();
}

export async function validateLogin(ctx: Context, next: () => Promise<any>) {
  await ctx.validate({
    email: 'required|string|email|max:255',
    password: 'required|string|min:6'
  });
  await next();
}

export async function validateRequestCode(ctx: Context, next: () => Promise<any>) {
  await ctx.validate({
    email: 'required|string|email|max:255'
  });
  await next();
}

export async function validateResetPassword(ctx: Context, next: () => Promise<any>) {
  await ctx.validate({
    code: 'required|integer',
    password: 'required|string|min:6'
  });
  await next();
}
