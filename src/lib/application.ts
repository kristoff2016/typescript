import * as http from 'http';
import * as koa from 'koa';
import * as bodyparser from 'koa-bodyparser';
import * as conditional from 'koa-conditional-get';
import * as etag from 'koa-etag';
import * as helmet from 'koa-helmet';
import * as logger from 'koa-logger';
import * as serve from 'koa-static';

import { countryExists, ethnicityExists, uniqueEmail } from './custom-rules';
import { errorHandler, indicative } from './middleware';
import { bindRoutingControllers } from './routing-controllers';
import { createConnection as createSequelizeConnection } from './sequelize';
import { bindSocketControllers } from './socket-controllers';

const app = new koa();

app.use(logger());
app.use(errorHandler());
app.use(helmet());
app.use(etag());
app.use(conditional());
app.use(bodyparser());
app.use(indicative({ rules: [ ethnicityExists, countryExists, uniqueEmail ] }));
app.use(serve('public'));

createSequelizeConnection();

bindRoutingControllers(app);

export const server = http.createServer(app.callback());

bindSocketControllers(server);
