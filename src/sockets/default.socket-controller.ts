import { ConnectedSocket, OnConnect, OnDisconnect, SocketController } from 'socket-controllers';

export function use(socket: SocketIO.Socket, next: Function) {
  console.log('Socket ID', socket.id, global.sequelize.models);
  next();
}

@SocketController()
export class DefaultSocketController {
  @OnConnect()
  connection(@ConnectedSocket() socket: SocketIO.Socket) {
    console.log('client connected');
  }

  @OnDisconnect()
  disconnect(@ConnectedSocket() socket: SocketIO.Socket) {
    console.log('client disconnected');
  }
}
