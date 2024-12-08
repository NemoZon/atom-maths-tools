const { default: mongoose } = require("mongoose");
const Formula = require("../models/formula.model");


class FormulaService {
    static async getFormulas({ id, author, latexExpression, legend, operationNodeId }) {
        const filter = {};
        if (author) {
            filter.author = { $regex: author, $options: 'i' }
        }
        if (latexExpression) {
          filter.latexExpression = { $regex: latexExpression, $options: 'i' }
        }
        if (legend) {
          filter.legend = { $regex: legend, $options: 'i' }
        }
        if (id && mongoose.Types.ObjectId.isValid(id)) {
            filter._id = mongoose.Types.ObjectId(id)
        }
        if (operationNodeId && mongoose.Types.ObjectId.isValid(operationNodeId)) {
          filter.operationNode = mongoose.Types.ObjectId(operationNodeId);
        }
        return await Formula.find(filter);
    }
    static async createFormula({ nodeId, author, legend, latexExpression }) {
        const node = await Node.findById(nodeId)

        if (!node) {
          throw new Error(`createFormula: node с id ${nodeId} не найдено`)
        }
  
        const formula = await Formula.create({ author, legend, latexExpression, operationNode: node._id });
        
        return formula;
    }
}

module.exports = FormulaService;