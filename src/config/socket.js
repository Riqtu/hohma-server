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

    socket.on("offer", (offer) => {
      socket.broadcast.emit("offer", offer);
    });

    socket.on("answer", (answer) => {
      socket.broadcast.emit("answer", answer);
    });

    socket.on("ice-candidate", (candidate) => {
      socket.broadcast.emit("ice-candidate", candidate);
    });

    socket.on("disconnect", () => {
      console.log("Клиент отключен:", socket.id);
    });
  });

  return io;
};

export default setupSocket;
