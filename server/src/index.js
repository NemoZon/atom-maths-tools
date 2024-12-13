const express = require('express');
const cors = require('cors');
const app = express();

const HelloRouter = require('./routes/hello.route');
const OperationRouter = require('./routes/operation.route');
const { default: mongoose } = require('mongoose');
const connectToDb = require('./data/connectToDb');
const initializeDatabase = require('./data/initializeDatabase');
const NodeRouter = require('./routes/node.route');
const FormulaRouter = require('./routes/formula.route');
const FormulaService = require('./services/formula.service');

const PORT = 5555;

connectToDb(mongoose);
initializeDatabase();

// Настройка CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Методы, которые можно использовать
}));

app.use(express.json());

app.use('/', HelloRouter);
app.use('/api/operation', OperationRouter);
app.use('/api/node', NodeRouter);
app.use('/api/formula', FormulaRouter);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
