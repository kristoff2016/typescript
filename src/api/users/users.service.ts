import * as moment from 'moment';
import { BadRequestError } from 'routing-controllers';
import { Service } from 'typedi';
import * as uuid from 'uuid/v4';
import * as bcrypt from 'bcryptjs'

import { sendEmailConfirmRegister } from '../../lib/mailer';
import ConfirmCode from '../../models/confirmation-code';
import ConfirmationCode from '../../models/confirmation-code';
import Device from '../../models/device.model';
import Role from '../../models/role.model';
import UserDevice from '../../models/user-device.model';
import { default as User, UserAttributes } from '../../models/user.model';
import { AuthService } from '../auth/auth.service';
import { ComfirmationCodeRequest, CreateUserWithDeviceOptions } from './users.interfaces';

@Service()
export class UserService {
  constructor(private authService: AuthService) {}

  async findUserRole(): Promise<Role> {
    const role = await Role.find<Role>({ where: { name: 'user' } });

    if (!role) throw new Error('Role was not found.');
    return role;
  }
  async findUserByEmail(email: string): Promise<User> {
    const user = await User.find<User>({ where: { email } });
    if (!user) throw new BadRequestError('User not found.');
    return user;
  }

  async UpdateUserPasswordByCode(code: number, password: string): Promise<void> {
    const hashPassword = bcrypt.hash(password, 10).toString();
    await global.sequelize.transaction(async t => {
      const queryOptions = { transaction: t };
      const codeExist = await ConfirmCode.findOne<ConfirmCode>({ where: { code }, ...queryOptions });
      if (!codeExist) throw new BadRequestError('Code not exist');

      if (moment().isAfter(codeExist.expireAt)) throw new BadRequestError('Code is expired');

      const confirmCode = await ConfirmCode.findOne<ConfirmCode>({
        where: { code: codeExist.code, type: 'reset_password' },
        ...queryOptions
      });
      if (!confirmCode) throw new BadRequestError('Confirm Code not found.');

      await User.update<User, UserAttributes>(
        {
          password: hashPassword
        },
        {
          where: { id: confirmCode.userId },
          ...queryOptions,
          individualHooks: true
        }
      );
      confirmCode.destroy(queryOptions);
    });
  }
  async createUserWithDevice(fields: CreateUserWithDeviceOptions): Promise<User> {
    const { id: roleId } = await this.findUserRole();
    const {
      udid,
      mac,
      name,
      osVersion,
      platform,
      email,
      password,
      weight,
      height,
      gender,
      genderPref,
      ethnicityId,
      countryCode
    } = fields;
    const result = await global.sequelize.transaction(async t => {
      const dateOfBirth = moment(fields.dateOfBirth).toISOString();
      const hashPassword = await this.authService.hashPassword(password);
      const queryOptions = { transaction: t };
      const [ user, [ device ] ] = await Promise.all<User, [Device, boolean]>([
        User.create<User, UserAttributes>(
          {
            email,
            password: hashPassword,
            weight,
            height,
            gender,
            genderPref,
            ethnicityId,
            countryCode,
            dateOfBirth,
            uid: uuid().replace(/-/g, ''),
            roleId
          },
          queryOptions
        ),
        Device.findOrBuild<Device>({
          where: { udid, mac },
          defaults: {
            name,
            udid,
            platform,
            mac,
            osVersion
          },
          ...queryOptions
        })
      ]);

      await device.save(queryOptions);

      await UserDevice.create<UserDevice>({ userId: user.id, deviceId: device.id }, queryOptions);

      return user;
    });

    return result;
  }
  async createResetPasswordCode(fields: ComfirmationCodeRequest) {
    const { code, expireAt, type, userId } = fields;
    await global.sequelize.transaction(async t => {
      const queryOptions = { transaction: t };
      await ConfirmCode.create(
        {
          code,
          expireAt,
          type,
          userId
        },
        queryOptions
      );
    });
  }

  async sendEmailConfirmCode(user: User) {
    const code = this.authService.generateRandomCode();
    await global.sequelize.transaction(async t => {
      ConfirmationCode.create<ConfirmationCode>(
        { code, expireAt: moment().add('5', 'minutes').toISOString(), userId: user.id, type: 'email' },
        { transaction: t }
      );
    });
    await sendEmailConfirmRegister({ code }, user.email);
  }

  async confirmEmail(code: number): Promise<void> {
    const confirmCode = await ConfirmationCode.find<ConfirmationCode>({
      where: { code, type: 'email' },
      include: [ User ]
    });
    if (!confirmCode) throw new BadRequestError('Invalid code.');
    if (moment().isAfter(confirmCode.expireAt)) throw new BadRequestError('Code is expired.');
    await global.sequelize.transaction(async t => {
      const queryOpts = { transaction: t };
      User.update<User>({ verified: true }, { where: { id: confirmCode.userId }, ...queryOpts });
      confirmCode.update({ expireAt: moment().toISOString() }, queryOpts); // set code to expire
    });
  }
}
