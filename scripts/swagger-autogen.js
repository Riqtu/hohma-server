import logger from "#config/logger.js";

(async () => {
  // Динамически импортируем swagger-autogen
  const { default: swaggerAutogen } = await import("swagger-autogen");

  const doc = {
    info: {
      title: "My API",
      description: "Описание вашего API",
    },
    host: "localhost:3000",
    schemes: ["http"],
  };

  const outputFile = "./tmp/swagger.json";
  const endpointsFiles = ["./src/routes/**/*.js"]; // Путь к вашим маршрутам

  swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    logger.info("Swagger документация сгенерирована!");
  });
})();
