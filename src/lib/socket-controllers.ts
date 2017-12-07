import { Server } from 'http';
import { useContainer as socketUseContainer, useSocketServer } from 'socket-controllers';
import * as SocketIO from 'socket.io';
import { Container } from 'typedi';

import { socketControllers } from '../config';

export function bindSocketControllers(server: Server) {
  const io = SocketIO(server, { transports: socketControllers.allowedTransportProtocols });

  if (socketControllers.middleware) {
    socketControllers.middleware.forEach(m => io.of(m.namespace).use(m.handler));
  }

  socketUseContainer(Container);
  useSocketServer(io, {
    controllers: socketControllers.controllers
  });

  global.io = io;
}
