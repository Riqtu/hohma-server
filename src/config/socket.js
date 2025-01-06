import { Server } from "socket.io";

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Клиент подключен:", socket.id);

    // Текстовый чат
    socket.emit("message", "Добро пожаловать в чат!");
    socket.on("message", (data) => {
      console.log(`Сообщение от клиента: ${data}`);
      io.emit("message", data);
    });

    // Голосовой чат: обработка сигналов WebRTC
    socket.on("join-room", (roomId) => {
      if (!roomId) {
        console.error("Room ID не указан");
        return;
      }

      socket.join(roomId);
      console.log(`Клиент ${socket.id} присоединился к комнате ${roomId}`);
      socket.to(roomId).emit("user-connected", socket.id);

      // Обработка WebRTC сигналов
      socket.on("offer", (offer, to) => {
        console.log(`Offer от ${socket.id} для ${to}`);
        io.to(to).emit("offer", offer, socket.id);
      });

      socket.on("answer", (answer, to) => {
        console.log(`Answer от ${socket.id} для ${to}`);
        io.to(to).emit("answer", answer, socket.id);
      });

      socket.on("candidate", (candidate, to) => {
        console.log(`Candidate от ${socket.id} для ${to}`);
        io.to(to).emit("candidate", candidate);
      });

      socket.on("disconnect", () => {
        console.log(`Клиент ${socket.id} отключился от комнаты ${roomId}`);
        socket.to(roomId).emit("user-disconnected", socket.id);
      });
    });
  });

  return io;
};

export default setupSocket;
