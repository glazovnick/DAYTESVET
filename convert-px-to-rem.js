#!/usr/bin/env node

/**
 * Скрипт для автоматического перевода px в rem в CSS файлах
 * Использование: node convert-px-to-rem.js [путь-к-файлу.css] [--base=16]
 */

const fs = require("fs");
const path = require("path");

// Параметры по умолчанию
const DEFAULT_BASE_SIZE = 16; // 1rem = 16px по умолчанию
const DEFAULT_FILE = "styles.css";

// Получаем аргументы командной строки
const args = process.argv.slice(2);
let filePath = DEFAULT_FILE;
let baseSize = DEFAULT_BASE_SIZE;

// Парсим аргументы
args.forEach((arg) => {
  if (arg.startsWith("--base=")) {
    baseSize = parseFloat(arg.split("=")[1]);
  } else if (arg.endsWith(".css")) {
    filePath = arg;
  }
});

// Функция для конвертации px в rem
function pxToRem(pxValue, base = baseSize) {
  const numValue = parseFloat(pxValue);
  if (isNaN(numValue)) return pxValue;

  // Округляем до 4 знаков после запятой для точности
  const remValue = (numValue / base).toFixed(4);

  // Убираем лишние нули
  return parseFloat(remValue).toString();
}

// Функция для проверки, находится ли позиция внутри медиа-запроса
function isInMediaQuery(cssContent, position) {
  const before = cssContent.substring(0, position);
  const lastMediaQuery = before.lastIndexOf("@media");

  if (lastMediaQuery === -1) return false;

  // Находим открывающую скобку медиа-запроса
  const openBrace = cssContent.indexOf("{", lastMediaQuery);
  if (openBrace === -1 || position < openBrace) {
    // Позиция находится в условии медиа-запроса (breakpoint)
    return true;
  }

  // Находим закрывающую скобку медиа-запроса
  let braceCount = 0;
  let inMediaQuery = false;
  for (let i = lastMediaQuery; i < position; i++) {
    if (cssContent[i] === "{") {
      braceCount++;
      inMediaQuery = true;
    } else if (cssContent[i] === "}") {
      braceCount--;
      if (braceCount === 0 && inMediaQuery) {
        // Мы вышли из медиа-запроса
        return false;
      }
    }
  }

  return inMediaQuery && braceCount > 0;
}

// Функция для проверки, находится ли позиция внутри clamp()
function isInClamp(cssContent, position) {
  const before = cssContent.substring(0, position);
  const lastClamp = before.lastIndexOf("clamp(");

  if (lastClamp === -1) return false;

  // Находим закрывающую скобку clamp()
  let parenCount = 0;
  for (let i = lastClamp; i < position; i++) {
    if (cssContent[i] === "(") parenCount++;
    else if (cssContent[i] === ")") parenCount--;
  }

  // Если мы еще не дошли до закрывающей скобки, значит мы внутри clamp()
  return parenCount > 0;
}

// Функция для замены px значений в CSS
function convertPxToRem(cssContent) {
  // Регулярное выражение для поиска значений в px
  const pxRegex = /(\d+\.?\d*)\s*px/gi;
  let result = "";
  let lastIndex = 0;
  let match;

  while ((match = pxRegex.exec(cssContent)) !== null) {
    const matchStart = match.index;
    const matchEnd = match.index + match[0].length;
    const value = match[1];

    // Добавляем текст до совпадения
    result += cssContent.substring(lastIndex, matchStart);

    // Проверяем, нужно ли пропустить это значение
    if (
      isInMediaQuery(cssContent, matchStart) ||
      isInClamp(cssContent, matchStart)
    ) {
      // Пропускаем - оставляем как есть
      result += match[0];
    } else {
      // Конвертируем в rem
      const remValue = pxToRem(value);
      result += `${remValue}rem`;
    }

    lastIndex = matchEnd;
  }

  // Добавляем оставшийся текст
  result += cssContent.substring(lastIndex);

  return result;
}

// Основная функция
function main() {
  const fullPath = path.resolve(filePath);

  // Проверяем существование файла
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Ошибка: Файл ${fullPath} не найден`);
    process.exit(1);
  }

  console.log(`📖 Читаю файл: ${fullPath}`);
  console.log(`🔢 Базовый размер: ${baseSize}px (1rem = ${baseSize}px)`);

  // Читаем файл
  let cssContent = fs.readFileSync(fullPath, "utf8");

  // Сохраняем оригинальную версию для бэкапа
  const backupPath = fullPath + ".backup";
  fs.writeFileSync(backupPath, cssContent, "utf8");
  console.log(`💾 Создан бэкап: ${backupPath}`);

  // Конвертируем
  const convertedContent = convertPxToRem(cssContent);

  // Подсчитываем количество замен
  const originalMatches = cssContent.match(/\d+\.?\d*\s*px/gi) || [];
  const convertedMatches = convertedContent.match(/\d+\.?\d*\s*rem/gi) || [];

  // Записываем результат
  fs.writeFileSync(fullPath, convertedContent, "utf8");

  console.log(`✅ Конвертация завершена!`);
  console.log(`📊 Найдено значений в px: ${originalMatches.length}`);
  console.log(`📊 Конвертировано в rem: ${convertedMatches.length}`);
  console.log(
    `\n💡 Совет: Проверьте результат и удалите бэкап файл, если всё в порядке`
  );
  console.log(`   Удалить бэкап: rm ${backupPath}`);
}

// Запускаем скрипт
main();
