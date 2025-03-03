export const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`❌ Отсутствует переменная окружения: ${key}`);
  }
  return value;
};
