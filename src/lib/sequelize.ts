import { Sequelize } from 'sequelize-typescript';

import { mysql as mysqlConfig } from '../config';

const { name, host, port, username, password, dialect, modelPaths, logging, sync } = mysqlConfig;

export function createConnection() {
  global.sequelize = new Sequelize({
    name,
    host,
    port,
    username,
    password,
    dialect,
    modelPaths,
    logging,
    sync: { force: sync || false, logging },
    define: {
      timestamps: true,
      freezeTableName: true,
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci'
    }
  });

  return global.sequelize;
}
