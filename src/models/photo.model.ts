import {
  AllowNull,
  AutoIncrement,
  BelongsToMany,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript';

import PhotoRating from './photo-rating.model';
import User from './user.model';

@Table({ name: { singular: 'photo', plural: 'photos' }, tableName: 'photos' })
export default class Photo extends Model<Photo> {
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataType.INTEGER.UNSIGNED })
  id: number;

  @AllowNull(false)
  @Column
  url: string;

  @AllowNull(false)
  @Column
  fileName: string;

  @AllowNull(false)
  @Default(false)
  @Column
  showRating: boolean;

  @BelongsToMany(() => User, () => PhotoRating)
  users: User[];
}
