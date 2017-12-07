import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript';

import User from './user.model';

@Table({ name: { singular: 'confirmation_code', plural: 'confirmation_codes' }, tableName: 'confirmation_codes' })
export default class ConfirmationCode extends Model<ConfirmationCode> {
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataType.INTEGER.UNSIGNED })
  id: number;

  @AllowNull(false)
  @Column
  code: number;

  @AllowNull(false)
  @Column
  expireAt: Date;

  @AllowNull(false)
  @Column({ type: DataType.ENUM([ 'email', 'reset_password' ]) })
  type: 'email' | 'reset_password';

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER.UNSIGNED })
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
