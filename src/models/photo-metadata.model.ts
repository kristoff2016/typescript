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

import Ethnicity from './ethnicity.model';
import Photo from './photo.model';

@Table({ name: { singular: 'photoMetadata', plural: 'photoMetadata' }, tableName: 'photo_metadata' })
export default class PhotoMetadata extends Model<PhotoMetadata> {
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataType.INTEGER.UNSIGNED })
  id: number;

  @AllowNull(false)
  @Column
  weight: number;

  @AllowNull(false)
  @Column
  height: number;

  @AllowNull(false)
  @Column
  status: string;

  @AllowNull(false)
  @Column
  age: number;

  @AllowNull(false)
  @Column
  gender: Gender;

  @ForeignKey(() => Ethnicity)
  @Column({ type: DataType.INTEGER.UNSIGNED })
  ethnicityId: number;

  @BelongsTo(() => Ethnicity, { foreignKey: { allowNull: false } })
  ethnicity: Ethnicity;

  @ForeignKey(() => Photo)
  photoId: number;

  @BelongsTo(() => Photo)
  photo: Photo;
}

export enum Gender {
  male = 'male',
  female = 'female'
}
