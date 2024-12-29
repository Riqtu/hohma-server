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

    socket.emit("message", "Добро пожаловать в чат!");

    socket.on("message", (data) => {
      console.log(`Сообщение от клиента: ${data}`);
      io.emit("message", data);
    });

    socket.on("disconnect", () => {
      console.log("Клиент отключился:", socket.id);
    });
  });

  return io;
};

export default setupSocket;
