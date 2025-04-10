// import express from 'express'
// import http from 'http'
// import cors from 'cors'
// import { Server } from 'socket.io'

// const app = express();
// app.use(cors());

// const server = http.createServer(app);

// const io = new Server(server, {
//     cors: {
//         origin: "*", // allow all (or specify React app URL)
//     },
// });

// io.on("connection", (socket) => {
//     console.log("User connected:", socket.id);

//     socket.on("send_message", (data) => {
//         io.emit("receive_message", data);
//     });

//     socket.on("disconnect", () => {
//         console.log("User disconnected:", socket.id);
//     });
// });

// server.listen(3001, () => {
//     console.log("Server running on port 3001");
// });

import express from 'express'
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinRoom', (roomName) => {
    if (roomName.startsWith('/group-')) {
      socket.join(roomName);
      console.log(`${socket.id} joined group: ${roomName}`);
    } else {
      const users = roomName.split('-');
      if (users.length === 2) {
        const privateRoom = `private-${[...users].sort().join('-')}`;
        socket.join(privateRoom);
        console.log(`${socket.id} joined private room: ${privateRoom}`);
      }
    }
  });

  socket.on('sendMessage', ({ roomName, message, sender }) => {
    if (roomName.startsWith('/group-')) {
      io.to(roomName).emit('receiveMessage', { sender, message });
    } else {
      const users = roomName.split('-');
      const privateRoom = `private-${[...users].sort().join('-')}`;
      io.to(privateRoom).emit('receiveMessage', { sender, message });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(5000, () => {
  console.log('Server running on port 5000');
});
