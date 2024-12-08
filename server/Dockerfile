# Используем Node.js
FROM node:18

WORKDIR /app

# Установим зависимости
COPY package*.json ./
RUN npm install

# Скопируем исходный код
COPY . .

# Экспонируем порт
EXPOSE 5555

CMD ["node", "src/index.js"]

