import {
  AllowNull,
  AutoIncrement,
  BelongsToMany,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  Unique
} from 'sequelize-typescript';

import UserDevice from './user-device.model';
import User from './user.model';

@Table({ name: { singular: 'device', plural: 'devices' }, tableName: 'devices' })
export default class Device extends Model<Device> {
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataType.INTEGER.UNSIGNED })
  id: number;

  @Column name: string;

  @AllowNull(false)
  @Unique
  @Column
  udid: string;

  @AllowNull(false)
  @Column
  platform: string;

  @AllowNull(false)
  @Column
  osVersion: string;

  @AllowNull(false)
  @Unique
  @Column
  mac: string;

  @BelongsToMany(() => User, () => UserDevice)
  users: User[];
}

export type DeviceAttributes = Partial<Pick<Device, 'id' | 'name' | 'udid' | 'platform' | 'osVersion' | 'mac'>>;
