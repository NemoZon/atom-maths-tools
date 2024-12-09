const { default: mongoose } = require("mongoose");
const Formula = require("../models/formula.model");
const Node = require("../models/node.model");


class FormulaService {
    static async getFormulas({id, author, latexExpression, legend, operationNodeId} = {}) {
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
            filter._id = new mongoose.Types.ObjectId(id)
        }
        if (operationNodeId && mongoose.Types.ObjectId.isValid(operationNodeId)) {
          filter.operationNode = new mongoose.Types.ObjectId(operationNodeId);
        }
        return await Formula.find(filter);
    }
    static async createFormula({ nodeId, author, legend, latexExpression } = {}) {        
        const node = await Node.findById(nodeId)
        
        if (!node) {
          throw new Error(`createFormula: node с id ${nodeId} не найдено`)
        }
  
        const formula = await Formula.create({ author, legend, latexExpression, operationNode: node._id });
        
        let nodesToPatch = [node];
        while (nodesToPatch.length > 0) {
          const childNode = nodesToPatch.pop()
          childNode.formula = formula._id;

          for (let j = 0; j < childNode.params.length; j++) {
            const param = childNode.params[j];
            if (mongoose.Types.ObjectId.isValid(param)) {
              const nodeToPush = await Node.findById(param)
              nodesToPatch.push(nodeToPush);
            }
          }

          await childNode.save();
        }

        return formula;
    }
    static async analyzeFormula({ formulaId } = {}) {    
      const formula = await Formula.findById(formulaId)
      const formulas = (await Formula.find({})).filter((f) => f._id !== formula._id)

      if (!formula) {
        throw new Error(`analyzeFormula: formula с id ${formulaId} не найдена`)
      }

      let maxNote = 0;
      const formulaOperations = []
      const nodesToFetch = [formula.operationNode]
      while (nodesToFetch.length > 0) {
        const lastNodeID = nodesToFetch.pop();
        const lastNode = await Node.findById(lastNodeID)
        const operationToPush = {
          operation: lastNode.operation.toString(),
          params: lastNode.params.filter(mongoose.Types.ObjectId.isValid)
        }
        // добавляем очки только за операции вложенные в другие операции
        maxNote += 1 + operationToPush.params.length;
        formulaOperations.push(operationToPush);

        for (let i = 0; i < lastNode.params.length; i++) {
          const nodeParam = lastNode.params[i];
          const isObjectId = mongoose.Types.ObjectId.isValid(nodeParam)
          if (isObjectId) {
            nodesToFetch.push(nodeParam);
          }
        }
      }

      const formulasToFetch = [...formulas]
      while (formulasToFetch.length > 0) {

      }
  }
}

module.exports = FormulaService;