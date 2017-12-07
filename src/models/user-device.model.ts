import { Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';

import Device from './device.model';
import User from './user.model';

@Table({ name: { singular: 'userDevice', plural: 'userDevices' }, tableName: 'users_devices' })
export default class UserDevice extends Model<UserDevice> {
  @ForeignKey(() => User)
  @PrimaryKey
  @Column({ type: DataType.INTEGER.UNSIGNED })
  userId: number;

  @ForeignKey(() => Device)
  @PrimaryKey
  @Column({ type: DataType.INTEGER.UNSIGNED })
  deviceId: number;
}
