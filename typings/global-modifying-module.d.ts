import { Sequelize } from 'sequelize-typescript';

declare global {
  namespace NodeJS {
    interface Global {
      io: SocketIO.Server;
      sequelize: Sequelize;
    }
  }
}
