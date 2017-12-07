import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript';

import Device from './device.model';
import User from './user.model';

@Table({ name: { singular: 'loginLog', plural: 'loginLogs' }, tableName: 'login_logs' })
export default class LoginLog extends Model<LoginLog> {
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataType.INTEGER.UNSIGNED })
  id: number;

  @AllowNull(false)
  @Column
  ip: string;

  @Column lat?: string;

  @Column lng?: string;

  @AllowNull(false)
  @Column
  appVersion: string;

  @AllowNull(false)
  @Default(false)
  @Column
  browser: boolean;

  @ForeignKey(() => Device)
  @Column({ type: DataType.INTEGER.UNSIGNED })
  deviceId: number;

  @BelongsTo(() => Device)
  device: Device;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER.UNSIGNED })
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
