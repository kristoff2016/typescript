import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({
  name: { singular: 'continent', plural: 'continents' },
  tableName: 'continents',
  timestamps: false
})
export default class Continent extends Model<Continent> {
  @PrimaryKey
  @Column
  code: string;

  @Column name: string;
}
