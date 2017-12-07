import * as env from 'dotenv';
import * as path from 'path';

/**
 * Load environment variables from .env in root directory
 */
(function loadEnv() {
  env.config();

  // verify env variables
  [
    'NODE_ENV',
    'PORT',
    'SECRET',
    'MYSQL_DB',
    'MYSQL_HOST',
    'MYSQL_PORT',
    'MYSQL_USERNAME',
    'MYSQL_PASSWORD',
    'SEQUELIZE_LOGGING',
    'PASSWORD_SALT',
    'MAIL_USERNAME',
    'MAIL_PASSWORD',
    'MAIL_FROM',
    'MAIL_SERVICE'
  ].forEach(name => {
    if (!process.env[name]) {
      throw new Error(`Environment variable ${name} is missing.`);
    }
  });
})();

const {
  NODE_ENV,
  PORT,
  SECRET,
  MYSQL_DB,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USERNAME,
  MYSQL_PASSWORD,
  SEQUELIZE_LOGGING,
  PASSWORD_SALT,
  MAIL_USERNAME,
  MAIL_PASSWORD,
  MAIL_FROM,
  MAIL_SERVICE
} = process.env;

export const app: AppConfig = {
  env: NODE_ENV!,
  port: +PORT!,
  secret: SECRET!,
  passwordSalt: PASSWORD_SALT!
};

export const mysql: MySQLConfig = {
  name: MYSQL_DB!,
  host: MYSQL_HOST!,
  port: +MYSQL_PORT!,
  username: MYSQL_USERNAME!,
  password: MYSQL_PASSWORD!,
  dialect: 'mysql',
  modelPaths: [ __dirname + '/models' ],
  logging: SEQUELIZE_LOGGING === 'true' ? console.log : false
};

export const routingControllers: RoutingControllersConfig = {
  controllers: [ path.resolve(__dirname, './api/**/*.controller.ts') ]
};

export const socketControllers: SocketControllersConfig = {
  allowedTransportProtocols: [ 'polling', 'websocket' ],
  controllers: [ path.resolve(__dirname, './sockets/**/*.socket-controller.ts') ],
  middleware: [ { namespace: '/', handler: require('./sockets/default.socket-controller').use } ]
};

export const mailer: MailerCofig = {
  username: MAIL_USERNAME!,
  password: MAIL_PASSWORD!,
  from: MAIL_FROM!,
  mailservice: MAIL_SERVICE!
};

interface AppConfig {
  env: string;
  port: number;
  secret: string;
  passwordSalt: string;
}

interface MySQLConfig {
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
  dialect: string;
  modelPaths?: string[];
  logging: boolean | Function;
  sync?: boolean;
}

interface RoutingControllersConfig {
  controllers: string[];
}

interface SocketControllersConfig {
  allowedTransportProtocols: ('polling' | 'websocket')[];
  controllers: string[];
  middleware?: { namespace: string; handler: (socket: SocketIO.Socket, fn: (err?: any) => void) => void }[];
}

interface MailerCofig {
  username: string;
  password: string;
  from: string;
  mailservice: string;
}
