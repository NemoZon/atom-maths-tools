const Operation = require("../models/operation.model");

async function addDefaultOperations() {
    const count = await Operation.countDocuments();
    
    if (count === 0) {
      console.log('Коллекция пуста. Добавляем сущности...');
      const defaultOperations = [
          {
            "name": "Дробь a на b",
            "params": ["a", "b"],
            "latexExpression": "\\frac{${a}}{${b}}"
          },
          {
            "name": "Квадратный корень из числа n",
            "params": ["n"],
            "latexExpression": "\\sqrt{${n}}"
          },
          {
            "name": "Интеграл от функции f по переменной x",
            "params": ["f", "x"],
            "latexExpression": "\\int {${f}} \\, d{${x}}"
          },
          {
            "name": "Логарифм числа x по основанию a",
            "params": ["x", "a"],
            "latexExpression": "\\log_{${a}}{${x}}"
          },
          {
            "name": "Возведение числа a в степень b",
            "params": ["a", "b"],
            "latexExpression": "${a}^{${b}}"
          },
          {
            "name": "Равенство выражений a и b",
            "params": ["a", "b"],
            "latexExpression": "${a} = ${b}"
          },
          {
            "name": "Умножение a на b",
            "params": ["a", "b"],
            "latexExpression": "${a} \\times ${b}"
          },
          {
            "name": "Сумма a и b",
            "params": ["a", "b"],
            "latexExpression": "${a} + ${b}"
          },
          {
            "name": "Вычитание b из a",
            "params": ["a", "b"],
            "latexExpression": "${a} - ${b}"
          },
          {
            "name": "Деление a на b",
            "params": ["a", "b"],
            "latexExpression": "\\frac{${a}}{${b}}"
          }
      ];
      
      try {
        await Operation.insertMany(defaultOperations);
        console.log('Данные успешно добавлены.');
      } catch (err) {
        console.error('Ошибка при добавлении данных:', err);
      }
    } else {
      console.log('Коллекция уже содержит данные.');
    }
}

// Проверка и добавление данных
async function initializeDatabase() {
    addDefaultOperations();
};

module.exports = initializeDatabase;