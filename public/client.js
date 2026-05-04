// Socket connection
const socket = io();

// DOM Elements
const joinSection = document.getElementById('joinSection');
const appSection = document.getElementById('appSection');
const usernameInput = document.getElementById('username');
const roomIdInput = document.getElementById('roomId');
const joinBtn = document.getElementById('joinBtn');
const leaveBtn = document.getElementById('leaveBtn');
const canvasContainer = document.getElementById('canvas');
const diagramType = document.getElementById('diagramType');
const colorPicker = document.getElementById('colorPicker');
const colorValue = document.getElementById('colorValue');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const chatMessages = document.getElementById('chatMessages');
const clearCanvasBtn = document.getElementById('clearCanvasBtn');
const currentRoomSpan = document.getElementById('currentRoom');
const currentUserSpan = document.getElementById('currentUser');
const userCountSpan = document.getElementById('userCount');
const usersList = document.getElementById('usersList');

// Application state
let currentUsername = '';
let currentRoomId = '';
let currentColor = '#3498db';
let canvas = null;
let ctx = null;
let currentDiagram = 'mandala';
let regions = {}; // Store regions with { path, color }
let usersInRoom = [];

// Canvas setup
function setupCanvas(diagramName) {
  currentDiagram = diagramName;
  
  if (canvas) {
    canvasContainer.removeChild(canvas);
  }
  
  canvas = document.createElement('canvas');
  canvas.width = canvasContainer.clientWidth - 40;
  canvas.height = Math.max(400, canvasContainer.clientHeight - 40);
  ctx = canvas.getContext('2d');
  
  // Set white background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Initialize regions
  regions = {};
  
  // Draw diagram with regions
  drawDiagramWithRegions(diagramName);
  
  // Add click event listener
  canvas.addEventListener('click', handleCanvasClick);
  canvas.addEventListener('touch', handleCanvasClick);
  
  canvasContainer.appendChild(canvas);
}

// Handle canvas clicks to fill regions
function handleCanvasClick(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  // Find which region was clicked
  for (let regionId in regions) {
    const region = regions[regionId];
    if (ctx.isPointInPath(region.path, x, y)) {
      // Fill the region
      region.color = currentColor;
      redrawCanvas();
      
      // Broadcast to other users
      socket.emit('fillRegion', {
        regionId: regionId,
        color: currentColor
      });
      break;
    }
  }
}

// Redraw canvas with all filled regions
function redrawCanvas() {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Redraw all regions
  for (let regionId in regions) {
    const region = regions[regionId];
    ctx.fillStyle = region.color || '#ffffff';
    ctx.fill(region.path);
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2;
    ctx.stroke(region.path);
  }
}

// Draw diagram outlines with regions
function drawDiagramWithRegions(type) {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  switch(type) {
    case 'mandala':
      drawMandalaWithRegions(centerX, centerY);
      break;
    case 'circle':
      drawCircularSegmentsWithRegions(centerX, centerY);
      break;
    case 'hexagon':
      drawHexagonGridWithRegions(centerX, centerY);
      break;
    case 'star':
      drawStarPatternWithRegions(centerX, centerY);
      break;
    case 'geometric':
      drawGeometricGridWithRegions(centerX, centerY);
      break;
    case 'flower':
      drawFlowerPatternWithRegions(centerX, centerY);
      break;
    case 'triangle':
      drawTriangleGridWithRegions(centerX, centerY);
      break;
    case 'wave':
      drawWavePatternWithRegions(centerX, centerY);
      break;
  }
}

function drawMandalaWithRegions(x, y) {
  const petals = 12;
  const maxRadius = 120;
  
  // Draw outer petals
  for (let i = 0; i < petals; i++) {
    const angle = (Math.PI * 2 / petals) * i;
    const path = new Path2D();
    
    const x1 = x + Math.cos(angle) * 80;
    const y1 = y + Math.sin(angle) * 80;
    const x2 = x + Math.cos(angle + 0.3) * maxRadius;
    const y2 = y + Math.sin(angle + 0.3) * maxRadius;
    const x3 = x + Math.cos(angle - 0.3) * maxRadius;
    const y3 = y + Math.sin(angle - 0.3) * maxRadius;
    
    path.moveTo(x1, y1);
    path.lineTo(x2, y2);
    path.arc(x, y, maxRadius - 20, angle + 0.3, angle - 0.3, true);
    path.closePath();
    
    regions[`petal_${i}`] = { path: path, color: '#ffffff' };
    
    ctx.fillStyle = '#ffffff';
    ctx.fill(path);
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2;
    ctx.stroke(path);
  }
  
  // Draw center circle
  const centerPath = new Path2D();
  centerPath.arc(x, y, 25, 0, Math.PI * 2);
  regions['center'] = { path: centerPath, color: '#ffffff' };
  
  ctx.fillStyle = '#ffffff';
  ctx.fill(centerPath);
  ctx.strokeStyle = '#2c3e50';
  ctx.lineWidth = 2;
  ctx.stroke(centerPath);
}

function drawCircularSegmentsWithRegions(x, y) {
  const radius = 120;
  const segments = 16;
  
  for (let i = 0; i < segments; i++) {
    const angle1 = (Math.PI * 2 / segments) * i;
    const angle2 = (Math.PI * 2 / segments) * (i + 1);
    
    const path = new Path2D();
    path.arc(x, y, radius, angle1, angle2);
    path.lineTo(x, y);
    path.closePath();
    
    regions[`segment_${i}`] = { path: path, color: '#ffffff' };
    
    ctx.fillStyle = '#ffffff';
    ctx.fill(path);
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2;
    ctx.stroke(path);
  }
  
  // Draw center circle
  const centerPath = new Path2D();
  centerPath.arc(x, y, 20, 0, Math.PI * 2);
  regions['center_circle'] = { path: centerPath, color: '#ffffff' };
  
  ctx.fillStyle = '#ffffff';
  ctx.fill(centerPath);
  ctx.strokeStyle = '#2c3e50';
  ctx.lineWidth = 2;
  ctx.stroke(centerPath);
}

function drawHexagonGridWithRegions(x, y) {
  const hexSize = 40;
  const cols = 5;
  const rows = 5;
  
  const drawHexagonRegion = (hx, hy, size, regionId) => {
    const path = new Path2D();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const px = hx + size * Math.cos(angle);
      const py = hy + size * Math.sin(angle);
      if (i === 0) path.moveTo(px, py);
      else path.lineTo(px, py);
    }
    path.closePath();
    
    regions[regionId] = { path: path, color: '#ffffff' };
    
    ctx.fillStyle = '#ffffff';
    ctx.fill(path);
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2;
    ctx.stroke(path);
  };
  
  const startX = x - (cols * hexSize) / 2;
  const startY = y - (rows * hexSize * 0.75) / 2;
  
  let regionCount = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const hx = startX + col * hexSize + (row % 2) * hexSize / 2;
      const hy = startY + row * hexSize * 0.75;
      drawHexagonRegion(hx, hy, 18, `hex_${regionCount++}`);
    }
  }
}

function drawStarPatternWithRegions(x, y) {
  const drawStarRegion = (cx, cy, size, regionId) => {
    const points = 5;
    const outerRadius = size;
    const innerRadius = size * 0.4;
    
    const path = new Path2D();
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (Math.PI / points) * i - Math.PI / 2;
      const px = cx + radius * Math.cos(angle);
      const py = cy + radius * Math.sin(angle);
      if (i === 0) path.moveTo(px, py);
      else path.lineTo(px, py);
    }
    path.closePath();
    
    regions[regionId] = { path: path, color: '#ffffff' };
    
    ctx.fillStyle = '#ffffff';
    ctx.fill(path);
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2;
    ctx.stroke(path);
  };
  
  // Central star
  drawStarRegion(x, y, 80, 'star_center');
  
  // Surrounding stars
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI * 2 / 6) * i;
    const sx = x + Math.cos(angle) * 100;
    const sy = y + Math.sin(angle) * 100;
    drawStarRegion(sx, sy, 30, `star_${i}`);
  }
}

function drawGeometricGridWithRegions(x, y) {
  const gridSize = 45;
  const cols = 6;
  const rows = 5;
  
  const startX = x - (cols * gridSize) / 2;
  const startY = y - (rows * gridSize) / 2;
  
  let regionCount = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const gx = startX + col * gridSize;
      const gy = startY + row * gridSize;
      
      const path = new Path2D();
      if ((row + col) % 2 === 0) {
        // Square
        path.rect(gx, gy, gridSize, gridSize);
      } else {
        // Diamond
        path.moveTo(gx + gridSize / 2, gy);
        path.lineTo(gx + gridSize, gy + gridSize / 2);
        path.lineTo(gx + gridSize / 2, gy + gridSize);
        path.lineTo(gx, gy + gridSize / 2);
        path.closePath();
      }
      
      regions[`geo_${regionCount++}`] = { path: path, color: '#ffffff' };
      
      ctx.fillStyle = '#ffffff';
      ctx.fill(path);
      ctx.strokeStyle = '#2c3e50';
      ctx.lineWidth = 2;
      ctx.stroke(path);
    }
  }
}

function drawFlowerPatternWithRegions(x, y) {
  const petals = 8;
  const petalSize = 50;
  
  // Draw petals
  for (let i = 0; i < petals; i++) {
    const angle = (Math.PI * 2 / petals) * i;
    const px = x + Math.cos(angle) * 40;
    const py = y + Math.sin(angle) * 40;
    
    const path = new Path2D();
    path.ellipse(px, py, petalSize / 2, petalSize, angle, 0, Math.PI * 2);
    
    regions[`petal_${i}`] = { path: path, color: '#ffffff' };
    
    ctx.fillStyle = '#ffffff';
    ctx.fill(path);
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2;
    ctx.stroke(path);
  }
  
  // Center circle
  const centerPath = new Path2D();
  centerPath.arc(x, y, 25, 0, Math.PI * 2);
  regions['center'] = { path: centerPath, color: '#ffffff' };
  
  ctx.fillStyle = '#ffffff';
  ctx.fill(centerPath);
  ctx.strokeStyle = '#2c3e50';
  ctx.lineWidth = 2;
  ctx.stroke(centerPath);
}

function drawTriangleGridWithRegions(x, y) {
  const triSize = 45;
  const cols = 6;
  const rows = 5;
  
  const startX = x - (cols * triSize) / 2;
  const startY = y - (rows * triSize * 0.5);
  
  let regionCount = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const tx = startX + col * triSize;
      const ty = startY + row * triSize * 0.866;
      
      const path = new Path2D();
      path.moveTo(tx, ty);
      path.lineTo(tx + triSize, ty);
      path.lineTo(tx + triSize / 2, ty + triSize * 0.866);
      path.closePath();
      
      regions[`tri_${regionCount++}`] = { path: path, color: '#ffffff' };
      
      ctx.fillStyle = '#ffffff';
      ctx.fill(path);
      ctx.strokeStyle = '#2c3e50';
      ctx.lineWidth = 2;
      ctx.stroke(path);
    }
  }
}

function drawWavePatternWithRegions(x, y) {
  const waveCount = 6;
  const amplitude = 30;
  const frequency = 0.01;
  
  for (let w = 0; w < waveCount; w++) {
    const yOffset = y - (waveCount * 35) / 2 + w * 35;
    const path = new Path2D();
    
    for (let px = 0; px <= canvas.width; px += 5) {
      const py = yOffset + Math.sin(px * frequency + w) * amplitude;
      if (px === 0) path.moveTo(px, py);
      else path.lineTo(px, py);
    }
    
    path.lineTo(canvas.width, yOffset + amplitude + 20);
    path.lineTo(0, yOffset + amplitude + 20);
    path.closePath();
    
    regions[`wave_${w}`] = { path: path, color: '#ffffff' };
    
    ctx.fillStyle = '#ffffff';
    ctx.fill(path);
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2;
    ctx.stroke(path);
  }
}

// Color picker change
colorPicker.addEventListener('input', (e) => {
  currentColor = e.target.value;
  colorValue.textContent = currentColor;
});

// Diagram selection
diagramType.addEventListener('change', (e) => {
  setupCanvas(e.target.value);
  socket.emit('diagramChanged', { diagram: e.target.value });
});

// Clear canvas
clearCanvasBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear the entire diagram?')) {
    socket.emit('clearCanvas');
  }
});

// Join Room
joinBtn.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  const roomId = roomIdInput.value.trim();

  if (username && roomId) {
    currentUsername = username;
    currentRoomId = roomId;
    socket.emit('joinRoom', { username, roomId });
  } else {
    alert('Please enter both username and room ID');
  }
});

// Leave Room
leaveBtn.addEventListener('click', () => {
  socket.disconnect();
  location.reload();
});

// Send message
sendBtn.addEventListener('click', () => {
  const message = messageInput.value.trim();
  if (message) {
    socket.emit('chatMessage', { message });
    messageInput.value = '';
    messageInput.focus();
  }
});

// Message input Enter key
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendBtn.click();
  }
});

// Socket.io Events

// User joined room
socket.on('userJoined', (data) => {
  const { username, userCount, users } = data;
  usersInRoom = users;
  userCountSpan.textContent = userCount;
  updateUsersList();
  
  if (username !== currentUsername) {
    addSystemMessage(`${username} joined the room`);
  }
});

// User left room
socket.on('userLeft', (data) => {
  const { username, userCount, users } = data;
  usersInRoom = users;
  userCountSpan.textContent = userCount;
  updateUsersList();
  addSystemMessage(`${username} left the room`);
});

// Load canvas on join
socket.on('loadCanvas', (data) => {
  setupCanvas(data.diagram || 'mandala');
  diagramType.value = data.diagram || 'mandala';
  
  // Apply all colored regions
  data.coloredRegions.forEach(item => {
    if (regions[item.regionId]) {
      regions[item.regionId].color = item.color;
    }
  });
  
  redrawCanvas();
});

// Remote fill region
socket.on('remoteFilledRegion', (data) => {
  if (regions[data.regionId]) {
    regions[data.regionId].color = data.color;
    redrawCanvas();
  }
});

// Diagram changed
socket.on('diagramChanged', (data) => {
  diagramType.value = data.diagram;
  setupCanvas(data.diagram);
});

// Canvas cleared
socket.on('canvasCleared', () => {
  setupCanvas(currentDiagram);
  addSystemMessage('Drawing was cleared');
});

// Load chat history
socket.on('loadChatHistory', (messages) => {
  chatMessages.innerHTML = '';
  messages.forEach(msg => {
    addMessage(msg.username, msg.message);
  });
});

// New message
socket.on('newMessage', (data) => {
  const { username, message } = data;
  addMessage(username, message);
});

// Connection events
socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

// Helper Functions

function toggleSections() {
  joinSection.classList.add('hidden');
  appSection.classList.remove('hidden');
  
  currentRoomSpan.textContent = currentRoomId;
  currentUserSpan.textContent = currentUsername;
}

function addMessage(username, message) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('chat-message');
  
  const usernameDiv = document.createElement('div');
  usernameDiv.classList.add('message-username');
  usernameDiv.textContent = username;
  
  const messageTextDiv = document.createElement('div');
  messageTextDiv.classList.add('message-text');
  messageTextDiv.textContent = message;
  
  const timeDiv = document.createElement('div');
  timeDiv.classList.add('message-time');
  const time = new Date().toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  timeDiv.textContent = time;
  
  messageDiv.appendChild(usernameDiv);
  messageDiv.appendChild(messageTextDiv);
  messageDiv.appendChild(timeDiv);
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addSystemMessage(message) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('chat-message', 'system');
  messageDiv.textContent = `ℹ️ ${message}`;
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function updateUsersList() {
  usersList.innerHTML = '';
  usersInRoom.forEach(user => {
    const userItem = document.createElement('div');
    userItem.classList.add('user-item');
    if (user.id === socket.id) {
      userItem.classList.add('current');
    }
    userItem.textContent = user.username;
    usersList.appendChild(userItem);
  });
}

// Initialize on successful join
socket.on('joinSuccess', (data) => {
  if (data.roomId) {
    currentRoomId = data.roomId;
    currentUsername = data.username || currentUsername;
    toggleSections();
  }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  usernameInput.focus();
});
