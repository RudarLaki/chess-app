// server.js
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
const { v4: uuidV4 } = require("uuid");

const app = express();
const server = http.createServer(app);

// ✨ CORS must be first
app.use(
  cors({
    origin: "https://16.170.40.88/", // Your frontend
    methods: ["GET", "POST"],
  })
);

app.use(express.json());
app.use(express.static("public")); // If you have any static files (optional)

const io = new Server(server, {
  cors: {
    origin: "https://16.170.40.88/",
    methods: ["GET", "POST"],
  },
});

// ✨ Socket.io logic
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Joining a room
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  // Handling a move
  socket.on("Move", ({ roomId, moveData }) => {
    console.log(`Move in room ${roomId}:`, moveData);
    socket.to(roomId).emit("Move", moveData);
    // Only send to players in the same room
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ✨ API route to create a new Room ID
app.get("/newRoom", (req, res) => {
  const newRoomId = uuidV4();
  res.json({ roomId: newRoomId });
});

// ✨ Start server
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
