import { AllowNull, Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({
  name: { singular: 'country', plural: 'countries' },
  tableName: 'countries',
  timestamps: false
})
export default class Country extends Model<Country> {
  @PrimaryKey
  @Column
  code: string;

  @AllowNull(false)
  @Column
  name: string;

  @AllowNull(false)
  @Column
  native: string;

  @AllowNull(false)
  @Column
  phone: string;

  @AllowNull(false)
  @Column
  continent: string;

  @AllowNull(false)
  @Column
  capital: string;

  @AllowNull(false)
  @Column
  currency: string;

  @AllowNull(false)
  @Column
  languages: string;
}
