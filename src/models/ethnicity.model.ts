import { AllowNull, AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({
  name: { singular: 'ethnicity', plural: 'ethnicities' },
  tableName: 'ethnicities',
  timestamps: false
})
export default class Ethnicity extends Model<Ethnicity> {
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataType.INTEGER.UNSIGNED })
  id: number;

  @AllowNull(false)
  @Column
  name: string;
}
