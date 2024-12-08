const mongoose = require('mongoose');

const NodeSchema = new mongoose.Schema({
    // formula = ссылка на Formula, для которой эта нода существует
    formula: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Formula',
        required: false // не обязательна, так как нода создается раньше формулы
    },
    // params = список ЗНАЧЕНИЙ параметров из списка параметров данной операции (Node.operation) 
    // если например Node.operation равняется Operation у которого params равняется ['a', 'b'], то Node.params может быть ['2', '3']
    // что даст нам a = '2', b = '3'
    // param принимает строку String или mongoose.Schema.Types.ObjectId Operation
    params: {
      type: [mongoose.Schema.Types.Mixed],
      required: true,
      validate: {
        validator: function (arr) {
          return arr.every(
            v => typeof v === 'string' || v instanceof mongoose.Types.ObjectId
          );
        },
        message: 'Элемент массива должен быть строкой или объектом Operation!'
      }
    },
    // operation = сылка на операцию
    operation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Operation',
      required: true,
    },
})

const Node = mongoose.model('Node', NodeSchema);

module.exports = Node;