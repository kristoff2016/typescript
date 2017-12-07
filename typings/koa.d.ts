import { Rules, Messages } from 'indicative';

declare module 'koa' {
  interface Context {
    sanitize: (rules: Rules) => Promise<any>;
    validate: (rules: Rules, messages?: Messages) => Promise<void>;
  }
}
