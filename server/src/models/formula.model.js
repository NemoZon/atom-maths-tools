const mongoose = require('mongoose');

const FormulaSchema = new mongoose.Schema({
    // author = автор данной формулы, e.g. "Анри Пуанкаре"
    author: {
        type: String,
        default: 'Неизвестный автор', // базовое значение
    },
    // legend = легенда для формулы (тип которой может быть либо просто строкой , либо строкой в формате latex), 
    // e.g. "где g - ускорение свободного падения"
    legend: {
        type: String,
        required: false,
    },
    // latexExpression = готовая формула в формате latex
    // e.g. "b \cdot b = b^2"
    latexExpression: {
        type: String,
        required: false,
    },
    // operationNode = стартовая нода (Node), определяющая первую операцию
    operationNode: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Node',
        required: true,
    }
})

const Formula = mongoose.model('Formula', FormulaSchema);

module.exports = Formula;