module.exports.socket_io_init = (server) => {
  let PeerServer = require('peer').PeerServer;
  const io = require('socket.io').listen(server);
  
  let peerServer = new PeerServer({
    port: 3002,
    path: '/',
    host: '/'
  });

  io.on('connection', socket => {
    socket.on('join-classroom', (roomId, userId) => {
      socket.join(roomId);
      socket.to(roomId).broadcast.emit('student-connected', userId);
      socket.on('disconnect', () => {
        socket.to(roomId).broadcast.emit('student-disconnected', userId); 
      });
    });
  });

}