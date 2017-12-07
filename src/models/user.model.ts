import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique
} from 'sequelize-typescript';

import ConfirmationCode from './confirmation-code';
import Device from './device.model';
import Ethnicity from './ethnicity.model';
import PhotoRating from './photo-rating.model';
import Photo from './photo.model';
import Role from './role.model';
import UserDevice from './user-device.model';

@Table({ name: { singular: 'user', plural: 'users' }, tableName: 'users' })
export default class User extends Model<User> {
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataType.INTEGER.UNSIGNED })
  id: number;

  @AllowNull(false)
  @Unique
  @Column
  uid: string;

  @AllowNull(false)
  @Unique
  @Column
  email: string;

  @AllowNull(false)
  @Column
  password: string;

  @Column imageUrl?: string;

  @AllowNull(false)
  @Column({ type: DataType.DATE })
  dateOfBirth: Date | string;

  @AllowNull(false)
  @Default(0)
  @Column({ type: DataType.DECIMAL(10, 2) })
  coinAmount: string;

  // store weight using grams
  @AllowNull(false)
  @Column
  weight: number;

  // store height using centimeters
  @AllowNull(false)
  @Column
  height: number;

  @AllowNull(false)
  @Column({ type: DataType.ENUM([ 'male', 'female' ]) })
  gender: 'male' | 'female';

  @AllowNull(false)
  @Column
  genderPref: string;

  @ForeignKey(() => Ethnicity)
  @Column({ type: DataType.INTEGER.UNSIGNED })
  ethnicityId: number;

  @BelongsTo(() => Ethnicity, { foreignKey: { allowNull: false } })
  ethnicity: Ethnicity;

  @AllowNull(false)
  @Column
  countryCode: string;

  @AllowNull(false)
  @Default(false)
  @Column
  verified: boolean;

  @ForeignKey(() => Role)
  roleId: number;

  @BelongsTo(() => Role, { foreignKey: { allowNull: false, field: 'roleId' } })
  role: Role;

  @BelongsToMany(() => Device, () => UserDevice)
  devices: Device[];

  @BelongsToMany(() => Photo, () => PhotoRating)
  photos: Photo[];

  @HasMany(() => ConfirmationCode)
  confirmCodes: ConfirmationCode[];
}

export type UserAttributes = Partial<
  Pick<
    User,
    | 'id'
    | 'uid'
    | 'email'
    | 'password'
    | 'dateOfBirth'
    | 'coinAmount'
    | 'weight'
    | 'height'
    | 'gender'
    | 'genderPref'
    | 'ethnicityId'
    | 'ethnicity'
    | 'countryCode'
    | 'roleId'
    | 'role'
    | 'devices'
    | 'photos'
    | 'verified'
  >
>;
