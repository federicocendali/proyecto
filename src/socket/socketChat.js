import MessageManager from '../dao/messageManager.js';

const mensageManager = new MessageManager();

const socketChat = (socketServer) => {
  socketServer.on('connection', async (socket) => {
    socket.on('mensaje', async (info) => {
      await mensageManager.createMessage(info);
      socketServer.emit('chat', await mensageManager.getMessages());
    });
    socket.on('clearchat', async () => {
      await mensageManager.deleteMessage();
    });
    socket.on('nuevousuario', (usuario) => {
      socket.broadcast.emit('broadcast', usuario);
    });
  });
};

export default socketChat;
