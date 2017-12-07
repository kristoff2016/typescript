import { Column, DataType, ForeignKey, Model, PrimaryKey, Table, AllowNull } from 'sequelize-typescript';

import User from './user.model';
import Photo from './photo.model';

@Table({
  name: { singular: 'photoRating', plural: 'photoRatings' },
  tableName: 'photo_ratings',
  timestamps: false,
  paranoid: false
})
export default class PhotoRating extends Model<PhotoRating> {
  @ForeignKey(() => User)
  @PrimaryKey
  @Column({ type: DataType.INTEGER.UNSIGNED })
  userId: number;

  @ForeignKey(() => Photo)
  @PrimaryKey
  @Column({ type: DataType.INTEGER.UNSIGNED })
  photoId: number;

  @AllowNull(false)
  @Column
  rate: number;

  @AllowNull(false)
  @Column
  createdAt: Date;
}
