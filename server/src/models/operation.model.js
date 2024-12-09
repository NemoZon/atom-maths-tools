const mongoose = require('mongoose');

const OperationSchema = new mongoose.Schema({
    // name = описание формулы , например "квадратный корень из числа n"
    name: {
      type: String,
      required: true, // обязательное поле
      trim: true, // удаление пробелов
    },
    // params = список параметров; e.g. ['n']
    params: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "Список параметров не может быть пустым",
      },
    },
    // latexExpression = выражение операции в формате latex: "\sqrt{${n}}" - где параметры обернуты в шаблон ${}, для их распознавания на клиенте
    latexExpression: {
      type: String,
      required: true,
      validate: {
        validator: (val) => val.includes('${'),
        message: "Формула должна содержать параметры в формате '${}'",
      },
    },
    // isParamsOrderImportant - позволяет определить, является ли порядок параметров важным или нет
    // например для оператора "a = b", порядок не важен, так как "b = a" одно и тоже
    isParamsOrderImportant: {
      type: Boolean,
      default: false,
    }
})

const Operation = mongoose.model('Operation', OperationSchema);

module.exports = Operation;