import { extend, Messages, Rules, sanitize, validateAll, ValidationMethod } from 'indicative';
import { Context, Middleware } from 'koa';

export function indicative(opts?: IndicativeOptions): Middleware {
  if (opts && opts.rules && opts.rules.length) {
    opts.rules.forEach(rule => extend(rule.name, rule));
  }
  const customMessages = opts ? opts.messages : undefined;

  return async (ctx: Context, next: (err?: any) => Promise<any>) => {
    ctx.sanitize = async (rules: Rules) => sanitize(ctx.request.body, rules);

    ctx.validate = async function(rules: Rules, messages?: Messages) {
      const combinedMessages: any = {
        required: 'Field {{field}} is required.',
        in: (field: string, validation: string, args: any[]): string =>
          `Field ${field} must be one of the following values: ${args.join(', ')}.`.trim(),
        string: 'Field {{field}} must be of type string.',
        ...customMessages,
        ...messages
      };
      try {
        await validateAll(ctx.request.body, rules, combinedMessages);
      } catch (e) {
        const err = new Error();
        err.name = 'UnprocessableEntityError';
        err.message = 'Validation failed, unable to process the request.';
        (err as any).httpCode = 422;
        (err as any).errors = e;
        throw err;
      }
    };

    await next();
  };
}

export function errorHandler(): Middleware {
  return async (ctx: Context, next: () => Promise<any>) => {
    await next().catch(error => {
      console.error('Caught an error!', error);

      const { message = 'Internal Server Error', httpCode, stack, status, statusCode } = error;
      const code = +httpCode || +statusCode || +status || 500;

      ctx.set('X-Message', message);
      ctx.status = code;
      ctx.body = {
        httpCode: code,
        message,
        ...error,
        stack: process.env.NODE_ENV !== 'production' ? stack : undefined,
        headers: undefined
      };
    });
  };
}

interface IndicativeOptions {
  rules?: ValidationMethod[];
  messages?: Messages;
}
