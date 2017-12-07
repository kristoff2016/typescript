import * as nodemailer from 'nodemailer';
import * as pug from 'pug';

import { app as appConfig, mailer as mailCofig } from '../config';

const { from, password, mailservice, username } = mailCofig;

const transport = nodemailer.createTransport(
  {
    service: mailservice,
    auth: {
      user: username,
      pass: password
    },
    debug: appConfig.env !== 'production'
  },
  {
    from: from,
    headers: {
      'X-Laziness-level': 1000
    }
  }
);

export async function sendEmailConfirmRegister(opts: object, email: string): Promise<nodemailer.SentMessageInfo> {
  const compileFunc = pug.compileFile('public/views/email_templates/confirm-register.pug');
  const html = compileFunc(opts);
  const message = {
    from: 'API League <brainmusic2017@gmail.com>',
    to: email,
    subject: 'Confirm Register',
    generateTextFromHTML: true,
    html
  };

  return await transport.sendMail(message);
}

export async function sendEmailResetPassword(code: number, email: string): Promise<nodemailer.SentMessageInfo> {
  const compileFunc = pug.compileFile('public/views/email_templates/forget-password.pug');
  const html = compileFunc({ code });
  const message = {
    from: 'API League <brainmusic2017@gmail.com>',
    to: email,
    subject: 'Reset Password',
    generateTextFromHTML: true,
    html
  };
  return await transport.sendMail(message);
}
