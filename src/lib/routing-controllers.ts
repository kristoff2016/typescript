import * as Koa from 'koa';
import { useContainer as routingUseContainer, useKoaServer } from 'routing-controllers';
import { Container } from 'typedi';

import { routingControllers } from '../config';

export function bindRoutingControllers(app: Koa): void {
  routingUseContainer(Container);
  useKoaServer(app, {
    cors: true,
    controllers: routingControllers.controllers,
    defaultErrorHandler: false,
    development: process.env.NODE_ENV !== 'production',
    validation: false
  });
}
