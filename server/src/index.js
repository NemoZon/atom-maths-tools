const express = require('express');
const cors = require('cors');
const app = express();

const PORT = 5555;

// Настройка CORS
app.use(cors({
  origin: '*', // Разрешаем клиенту React
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Методы, которые можно использовать
  credentials: true, // Если используются куки или авторизация
}));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
