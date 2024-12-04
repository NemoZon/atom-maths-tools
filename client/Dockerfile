# Используем Node.js для сборки приложения
FROM node:18 AS build

WORKDIR /app

# Установим зависимости
COPY package*.json ./
RUN npm install

# Скопируем остальные файлы и соберем приложение
COPY . .
RUN npm run build

# Используем Nginx для раздачи статических файлов
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Экспонируем порт
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
