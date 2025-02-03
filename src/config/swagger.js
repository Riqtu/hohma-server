import fs from "fs";
import path from "path";
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";

const swaggerFiles = ["movie.yaml", "affirmation.yaml", "finalResults.yaml"];

const loadSwaggerDocs = () => {
  let combinedSwagger = {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "API для работы с разными сущностями",
    },
    paths: {},
    components: { schemas: {} },
  };

  swaggerFiles.forEach((file) => {
    const filePath = path.resolve(`./src/swagger/${file}`);
    if (!fs.existsSync(filePath)) {
      console.error(`⚠️ Файл ${file} не найден! Пропускаем...`);
      return;
    }

    const swaggerDoc = YAML.load(filePath);

    combinedSwagger.paths = { ...combinedSwagger.paths, ...swaggerDoc.paths };
    combinedSwagger.components.schemas = {
      ...combinedSwagger.components.schemas,
      ...swaggerDoc.components.schemas,
    };
  });

  // Создаем tmp-папку, если её нет
  const outputPath = "./tmp/swagger.json";
  if (!fs.existsSync("./tmp")) {
    fs.mkdirSync("./tmp", { recursive: true });
  }

  // Записываем JSON-файл в tmp
  fs.writeFileSync(outputPath, JSON.stringify(combinedSwagger, null, 2));

  return combinedSwagger;
};

const setupSwagger = (app) => {
  if (!app) {
    console.error("Ошибка: передано пустое приложение Express!");
    return;
  }

  try {
    const swaggerDocument = loadSwaggerDocs();
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    // Раздаем swagger.json через Express
    app.get("/swagger.json", (req, res) => {
      res.sendFile(path.resolve("./tmp/swagger.json"));
    });

    console.log("✅ Swagger подключен! JSON доступен по /swagger.json");
  } catch (error) {
    console.error("❌ Ошибка при загрузке Swagger:", error.message);
  }
};

export default setupSwagger;
