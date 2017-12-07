/* tslint:disable:no-unused-expression */
import * as chai from 'chai';

import { AuthService } from './auth.service';

const { expect } = chai;
const uid = '123456';
const password = '123456789!xyz';
let authService: AuthService;
let jwtToken = '';

before(function() {
  authService = new AuthService();
});

describe('AuthService', function() {
  describe('signJWT', function() {
    it('sign should return a string', async function() {
      jwtToken = await authService.signJWT({ uid });
      expect(jwtToken).to.be.string;
    });
  });

  describe('verifyJWT', function() {
    it('verify should return a valid jwt', async function() {
      const jwt = await authService.verifyJWT(jwtToken);
      expect(jwt.uid).to.equal(uid);
    });
  });

  describe('generateRandomCode', function() {
    it('should return number value', function() {
      const randNum = authService.generateRandomCode();
      expect(randNum).to.be.a('number');
    });
  });

  let hashedPassword = '';
  describe('hashPassword', function() {
    it('should return a hashed password as a string', async function() {
      hashedPassword = await authService.hashPassword(password);
      expect(hashedPassword).to.not.equal(password);
      expect(hashedPassword).to.be.a('string');
    });
  });

  describe('comparePassword', function() {
    it('should verify that 2 passwords are the same', async function() {
      const comparision = await authService.comparePassword(password, hashedPassword);
      expect(comparision).to.be.true;
    });
  });
});
