# Co-Color: Real-Time Collaborative Canvas & Chat

A real-time, multi-user web application that enables seamless, synchronized creativity through collaborative diagram drawing and live chat. Built with Node.js and Socket.io using WebSocket protocol for zero-latency updates.

## 🎯 Features

- **Real-Time Drawing**: Multiple users can simultaneously draw on shared diagram outlines
- **Multiple Diagram Choices**: 8 different diagram templates to draw on:
  - 🌟 Mandala Pattern
  - ⭕ Circular Segments
  - ⬡ Hexagon Grid
  - ⭐ Star Pattern
  - 🔷 Geometric Grid
  - 🌸 Flower Pattern
  - △ Triangle Grid
  - 〰️ Wave Pattern
- **Instant Synchronization**: All drawing updates are broadcasted instantly to all users in a room
- **Private Rooms**: Create or join private rooms to collaborate with specific users
- **Live Chat**: Communicate with room members in real-time
- **Adjustable Brush Size**: Choose from 5 different brush sizes for drawing
- **Drawing Persistence**: All strokes are maintained and shared with newly joined users
- **User Presence**: See who else is in the room
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Backend**: Node.js with Express
- **Real-Time Communication**: Socket.io (WebSocket)
- **Frontend**: HTML5 Canvas API, CSS3, Vanilla JavaScript
- **Protocol**: WebSocket for bidirectional communication

## 💻 Usage

### For Users

1. **Open the Application**
   - Navigate to `http://localhost:3000` in your browser

2. **Join a Room**
   - Enter your username
   - Enter a room ID (create a new one or join an existing)
   - Click "Join Room"

3. **Collaborate on Drawing**
   - **Select Diagram**: Choose one of 8 diagram templates from the dropdown
   - **Adjust Brush Size**: Use the slider to set your preferred brush size (1-5px)
   - **Draw**: Click and drag on the canvas to draw on the diagram outline
   - **Real-Time Sync**: Your strokes appear instantly for all users in the room
   - **Chat**: Send messages to other users in the room
   - **Clear Drawing**: Clear all strokes from the current diagram

4. **Leave Room**
   - Click "Leave Room" to disconnect

## 🏗️ Project Structure

```
co-color/
├── server.js              # Main server file with Socket.io logic
├── package.json           # Project dependencies and scripts
├── .gitignore            # Git ignore file
├── README.md             # This file
└── public/
    ├── index.html        # Main HTML file
    ├── style.css         # CSS styling
    └── client.js         # Client-side drawing & Socket.io logic
```

## 🔧 Server Architecture

### Socket.io Events

#### Client to Server Events
- `joinRoom`: Join a specific room with username
- `draw`: Send drawing stroke coordinates and brush size
- `diagramChanged`: Change the current diagram template
- `chatMessage`: Send a chat message
- `clearCanvas`: Clear all drawing strokes

#### Server to Client Events
- `userJoined`: Notifies when a user joins the room
- `userLeft`: Notifies when a user leaves the room
- `loadCanvas`: Sends all strokes and current diagram to newly joined user
- `remoteDrawn`: Broadcasts drawing stroke from other users
- `diagramChanged`: Notifies when diagram is changed
- `newMessage`: Broadcasts new chat message
- `canvasCleared`: Notifies when canvas is cleared
- `loadChatHistory`: Sends chat history to newly joined user

## 🎨 Drawing Features

- **HTML5 Canvas**: Smooth, responsive drawing surface
- **Multiple Diagrams**: 8 different artistic and geometric templates
- **Stroke Persistence**: All strokes are stored and shared across users
- **Adjustable Brush**: 5 different brush sizes for fine or bold strokes
- **Clear Function**: Reset drawing strokes while keeping the diagram outline
- **Crosshair Cursor**: Visual indication of drawing mode

## 💬 Chat Features

- **Message History**: New users see previous messages
- **System Messages**: Notifications for user join/leave events
- **Real-Time Updates**: Messages appear instantly for all users
- **Timestamps**: Each message displays the time it was sent

## 🔐 Room Management

- **Private Rooms**: Each room is isolated with its own drawing canvas and chat
- **Automatic Cleanup**: Empty rooms are automatically deleted when the last user leaves
- **Diagram Persistence**: Diagram choice is maintained per room
- **Session Persistence**: Drawing strokes are maintained per room while it exists

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile devices (with touch support)

**Enjoy collaborative drawing with Co-Color!** 🎨✨
