const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(express.static(path.join(__dirname, 'public')));

// Store active rooms and their users
const rooms = {};

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`New user connected: ${socket.id}`);

  // User joins a room
  socket.on('joinRoom', (data) => {
    const { username, roomId } = data;
    
    socket.join(roomId);
    socket.username = username;
    socket.roomId = roomId;

    // Initialize room if it doesn't exist
    if (!rooms[roomId]) {
      rooms[roomId] = {
        users: [],
        diagram: 'mandala',
        coloredRegions: [], // Store colored regions
        messages: []
      };
    }

    rooms[roomId].users.push({
      id: socket.id,
      username: username
    });

    // Notify all users in the room that a user has joined
    io.to(roomId).emit('userJoined', {
      username: username,
      userCount: rooms[roomId].users.length,
      users: rooms[roomId].users
    });

    // Send current canvas state (diagram and colored regions) to the new user
    socket.emit('loadCanvas', {
      diagram: rooms[roomId].diagram,
      coloredRegions: rooms[roomId].coloredRegions
    });

    // Send chat history to the new user
    socket.emit('loadChatHistory', rooms[roomId].messages);

    console.log(`${username} joined room ${roomId}`);
  });

  // Handle region fill events
  socket.on('fillRegion', (data) => {
    const roomId = socket.roomId;

    if (roomId && rooms[roomId]) {
      const { regionId, color } = data;
      
      // Update or add colored region
      const existingRegion = rooms[roomId].coloredRegions.find(r => r.regionId === regionId);
      if (existingRegion) {
        existingRegion.color = color;
      } else {
        rooms[roomId].coloredRegions.push({
          regionId: regionId,
          color: color,
          username: socket.username
        });
      }

      // Broadcast to all other users in the room
      socket.to(roomId).emit('remoteFilledRegion', {
        regionId: regionId,
        color: color,
        username: socket.username
      });
    }
  });

  // Handle diagram change
  socket.on('diagramChanged', (data) => {
    const roomId = socket.roomId;

    if (roomId && rooms[roomId]) {
      rooms[roomId].diagram = data.diagram;
      rooms[roomId].strokes = []; // Clear strokes when diagram changes

      // Broadcast to all users in the room
      io.to(roomId).emit('diagramChanged', {
        diagram: data.diagram
      });

      console.log(`Diagram changed to ${data.diagram} in room ${roomId}`);
    }
  });

  // Handle chat messages
  socket.on('chatMessage', (data) => {
    const { message } = data;
    const roomId = socket.roomId;

    if (roomId && rooms[roomId]) {
      const messageObj = {
        username: socket.username,
        message: message,
        timestamp: Date.now()
      };

      rooms[roomId].messages.push(messageObj);

      // Broadcast message to all users in the room
      io.to(roomId).emit('newMessage', messageObj);
    }
  });

  // Handle canvas clear
  socket.on('clearCanvas', () => {
    const roomId = socket.roomId;

    if (roomId && rooms[roomId]) {
      rooms[roomId].coloredRegions = [];
      io.to(roomId).emit('canvasCleared');
      console.log(`Diagram cleared in room ${roomId} by ${socket.username}`);
    }
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    const roomId = socket.roomId;
    const username = socket.username;

    if (roomId && rooms[roomId]) {
      // Remove user from room
      rooms[roomId].users = rooms[roomId].users.filter(user => user.id !== socket.id);

      // Notify remaining users
      io.to(roomId).emit('userLeft', {
        username: username,
        userCount: rooms[roomId].users.length,
        users: rooms[roomId].users
      });

      // Delete room if empty
      if (rooms[roomId].users.length === 0) {
        delete rooms[roomId];
        console.log(`Room ${roomId} deleted (empty)`);
      }
    }

    console.log(`User disconnected: ${socket.id}`);
  });

  // Error handling
  socket.on('error', (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Co-Color server running on http://localhost:${PORT}`);
});
