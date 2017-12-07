import { AllowNull, AutoIncrement, Column, DataType, Model, PrimaryKey, Table, Unique } from 'sequelize-typescript';

@Table({ name: { singular: 'role', plural: 'roles' }, tableName: 'roles' })
export default class Role extends Model<Role> {
  @AllowNull(false)
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataType.INTEGER.UNSIGNED })
  id: number;

  @AllowNull(false)
  @Unique
  @Column
  name: string;

  @Column description?: string;
}
