import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { BadRequestError } from 'routing-controllers';
import { Service } from 'typedi';

import { app as appConfig } from '../../config';
import { JwtPayload } from './auth.interfaces';

@Service()
export class AuthService {
  async verifyJWT(token: string) {
    return new Promise<JwtPayload>((resolve, reject) => {
      jwt.verify(token, appConfig.secret, (err: Error, decoded: JwtPayload) => {
        if (err) return reject(err);
        resolve(decoded);
      });
    });
  }

  async signJWT(payload: JwtPayload, opts?: any) {
    return new Promise<string>((resolve, reject) => {
      jwt.sign(payload, appConfig.secret, opts, (err: Error, encoded: string) => {
        if (err) return reject(err);
        resolve(encoded);
      });
    });
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hashPassword: string) {
    const result = await bcrypt.compare(password, hashPassword);
    if (!result) throw new BadRequestError('Incorrect password.');
    return result;
  }

  generateRandomCode() {
    return Math.floor(100000 + Math.random() * 900000);
  }
}
