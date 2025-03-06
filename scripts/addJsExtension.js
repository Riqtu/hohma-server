import fs from "fs";

// Получаем путь к файлу из аргументов командной строки
const filePath = process.argv[2];
if (!filePath) {
  console.error("Usage: node addJsExtension.js <file-path>");
  process.exit(1);
}

// Читаем содержимое файла
let fileContent = fs.readFileSync(filePath, "utf8");
console.log(`Длина файла: ${fileContent.length} символов`);

// Регулярное выражение для поиска импортов вида:
// import { Something } from 'путь';
const importRegex = /import\s+(?:type\s+)?([^'"]+?)\s+from\s+(['"])([^'"]+?)(\2)/g;

// Находим все импортированные строки для отладки
const allMatches = [...fileContent.matchAll(importRegex)];
console.log(`Найдено ${allMatches.length} импортов в файле`);

let hasReplacements = false;

const modifiedContent = fileContent.replace(
  importRegex,
  (match, imports, quote, importPath, closingQuote) => {
    // Если импорт относительный и не заканчивается на ".js", то добавляем суффикс ".js"
    if (
      (importPath.startsWith("./") || importPath.startsWith("../")) &&
      !importPath.endsWith(".js")
    ) {
      console.log(`Найден импорт для замены: ${importPath}`);
      hasReplacements = true;
      return `import ${imports} from ${quote}${importPath}.js${closingQuote}`;
    }
    return match;
  }
);

if (!hasReplacements) {
  console.log("Не найдено импортов для замены. Проверьте формат импортов в файле.");
} else {
  console.log("Замены успешно выполнены.");
}

// Записываем изменения обратно в файл
fs.writeFileSync(filePath, modifiedContent, "utf8");
console.log(`Файл ${filePath} успешно обновлён.`);
