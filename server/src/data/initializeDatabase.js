const Node = require("../models/node.model");
const Operation = require("../models/operation.model");
const { getOperations } = require("../services/operation.service");
const { getNodes } = require("../services/node.service");
const { default: mongoose } = require("mongoose");
const Formula = require("../models/formula.model");


async function addDefaultOperations() {
    const count = await Operation.countDocuments();
    
    if (count === 0) {
      console.log('Коллекция operation пуста. Добавляем сущности...');
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
            "latexExpression": "${a} = ${b}",
            isParamsOrderImportant: false,
          },
          {
            "name": "Умножение a на b",
            "params": ["a", "b"],
            "latexExpression": "${a} \\times ${b}",
            isParamsOrderImportant: false,
          },
          {
            "name": "Сумма a и b",
            "params": ["a", "b"],
            "latexExpression": "${a} + ${b}",
            isParamsOrderImportant: false,
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
        const operations = await Operation.insertMany(defaultOperations);
        console.log('Данные успешно добавлены.');
        return operations;
      } catch (err) {
        console.error('Ошибка при добавлении данных operation:', err);
      }
    } else {
      console.log('Коллекция operation уже содержит данные.');
    }
}

async function addDefaultNodes(operations) {
  const count = await Node.countDocuments();
  if (count === 0) {
    console.log('Коллекция node пуста. Добавляем сущности...');
  
    const operationIds = operations ? 
      operations.map((operation) => operation._id) : 
      (await getOperations()).map((operation) => operation._id)

    // Ноды, которые не имеют дочерних нод
    const defaultNodeLeaves = [
        {
          params: ["b", "10"],
          operation: operationIds[Math.floor(Math.random() * operationIds.length)],
        },
        {
          params: ["x", "10"],
          operation: operationIds[Math.floor(Math.random() * operationIds.length)],
        },
        {
          params: ["2", "y"],
          operation: operationIds[Math.floor(Math.random() * operationIds.length)],
        },
        {
          params: ["10", "a"],
          operation: operationIds[Math.floor(Math.random() * operationIds.length)],
        },
        {
          params: ["b", "x"],
          operation: operationIds[Math.floor(Math.random() * operationIds.length)],
        },
        {
          params: ["x", "10"],
          operation: operationIds[Math.floor(Math.random() * operationIds.length)],
        },
        {
          params: ["1", "y"],
          operation: operationIds[Math.floor(Math.random() * operationIds.length)],
        },
        {
          params: ["g", "y"],
          operation: operationIds[Math.floor(Math.random() * operationIds.length)],
        },
        {
          params: ["b", "y"],
          operation: operationIds[Math.floor(Math.random() * operationIds.length)],
        },
        {
          params: ["a", "b"],
          operation: operationIds[Math.floor(Math.random() * operationIds.length)],
        },
    ];
    
    try {
      const nodeLeaves = await Node.insertMany(defaultNodeLeaves);

      // Ноды с дочерними нодами
      const defaultNodes = [
        {
          params: [nodeLeaves[0]._id, nodeLeaves[1]._id],
          operation: operationIds[Math.floor(Math.random() * operationIds.length)],
        },
        {
          params: [nodeLeaves[2]._id, nodeLeaves[3]]._id,
          operation: operationIds[Math.floor(Math.random() * operationIds.length)],
        },
        {
          params: [nodeLeaves[4]._id, nodeLeaves[5]._id],
          operation: operationIds[Math.floor(Math.random() * operationIds.length)],
        },
        {
          params: [nodeLeaves[6]._id, nodeLeaves[7]._id],
          operation: operationIds[Math.floor(Math.random() * operationIds.length)],
        },
        {
          params: [nodeLeaves[8]._id, nodeLeaves[9]._id],
          operation: operationIds[Math.floor(Math.random() * operationIds.length)],
        },
      ];
      const nodes = await Node.insertMany(defaultNodes);

      console.log('Данные node успешно добавлены.');
      return nodes;
    } catch (err) {
      console.error('Ошибка при добавлении данных node:', err);
    }
  } else {
    console.log('Коллекция node уже содержит данные.');
  }
}

async function addDefaultFormulas(nodes) {
  const count = await Formula.countDocuments();
  if (count === 0) {
    console.log('Коллекция formula пуста. Добавляем сущности...');
  
    const nodesIds = nodes ? 
      nodes.map((node) => node._id) : 
      (await getNodes()).filter((node) => node.params.some((param) => mongoose.Types.ObjectId.isValid(param))).map((node) => node._id)

    console.log(nodesIds);
    
    const defaultFolmulas = [
      {
        author: 'Анри Пуанкаре',
        legend: 'где g - ускорение свободного падения',
        latexExpression: 'b \\cdot b = b^2',
        operationNode: nodesIds[0], 
      },
      {
        author: 'Неизвестный автор',
        legend: 'где m - масса объекта, v - скорость',
        latexExpression: 'E = \\frac{1}{2} m v^2',
        operationNode: nodesIds[1],
      },
      {
        author: 'Исаак Ньютон',
        legend: 'где F - сила, m - масса, a - ускорение',
        latexExpression: 'F = m \\cdot a',
        operationNode: nodesIds[2],
      },
      {
        author: 'Неизвестный автор',
        legend: 'где x - координата, v - скорость, t - время',
        latexExpression: 'x = v \\cdot t',
        operationNode: nodesIds[3],
      },
    ];
    
    try {
      const formulas = await Formula.insertMany(defaultFolmulas);

      // сетим для каждой ноды ссылку на формулу
      for (let i = 0; i < formulas.length; i++) {
        const formula = formulas[i];
        const firstNode = await Node.findById(formula.operationNode);
        let nodesToPatch = [firstNode];
        while (nodesToPatch.length > 0) {
          const node = nodesToPatch.pop()
          node.formula = formula._id;

          for (let j = 0; j < node.params.length; j++) {
            const param = node.params[j];
            if (mongoose.Types.ObjectId.isValid(param)) {
              const nodeToPush = await Node.findById(param)
              nodesToPatch.push(nodeToPush);
            }
          }

          await node.save();
        }
      }

      console.log('Данные formula успешно добавлены.');

      return nodes
    } catch (err) {
      console.error('Ошибка при добавлении данных formula:', err);
    }
  } else {
    console.log('Коллекция formula уже содержит данные.');
  }
}

// Проверка и добавление данных
async function initializeDatabase() {
    const operations = await addDefaultOperations();
    const nodes = await addDefaultNodes(operations);
    await addDefaultFormulas(nodes);
};

module.exports = initializeDatabase;