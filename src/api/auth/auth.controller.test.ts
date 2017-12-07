/* tslint:disable:no-unused-expression */
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { server } from '../../lib/application';

chai.use(chaiHttp);

const { expect } = chai;

describe('AuthController', function() {
  describe('register', function() {
    let res: ChaiHttp.Response;
    it('should return 200 response', async function() {
      res = await chai
        .request(server)
        .post('/auth/register')
        .set('X-Device-Name', 'X-Device-Name-Test')
        .set('X-UDID', 'X-UDID-Test')
        .set('X-Platform', 'X-Platform-Test')
        .set('X-Mac', 'X-Mac-Test')
        .set('X-OS-Version', 'X-OS-Version-Test')
        .send({
          email: `mevsme.${Math.ceil(Math.random() * 999999)}@test.com`,
          password: '123456',
          dateOfBirth: '2001-01-01',
          weight: 75,
          height: 163,
          gender: 'male',
          genderPref: 'female',
          ethnicityId: 1,
          countryCode: 'KM'
        });
      expect(res.status).to.equal(200);
    });
    it('should response with body message equal success', function() {
      expect(res.body.message).to.equal('success');
    });
  });

  // describe('login', function() {
  //   let res: ChaiHttp.Response;
  //   describe('', async function() {
  //     chai.request(server).post().att
  //   });
  // });
});
