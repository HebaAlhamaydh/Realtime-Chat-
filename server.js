const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatCord Bot';

// 1.Run when client connects
io.on('connection', socket => {

  //14.username and room come from url
  socket.on('joinRoom', ({ username, room }) => {
    //17.return user has join 
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    //2. Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

    //4. Broadcast when a user connects(every user except the user connect)//.to(user.room)emit specific room 
    //(user)its object return from function userJoin(id,username,room)
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    //22.Send users and room info send object {room: user.room, users: getRoomUsers(user.room)}
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // 8.1. Listen for chatMessage from single  user
  socket.on('chatMessage', msg => {
    ///18
    const user = getCurrentUser(socket.id);
  ////8.2 emit message chat from single user to every body  .to(user.room)emit specific room 
  //(user)its object return from function getCurrentUser(socket.id)
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  //5. Runs when client disconnects
  socket.on('disconnect', () => {
    //21
    const user = userLeave(socket.id);
    //(user)its object return from function userLeave(socket.id)
    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      //23. Send users and room info send object {room: user.room, users: getRoomUsers(user.room)}
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));