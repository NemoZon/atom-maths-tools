const { default: mongoose } = require("mongoose");
const Formula = require("../models/formula.model");
const Node = require("../models/node.model");
const AnalyzeService = require("./analyze.service");


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

    static async __getFormulaNodesOrder(formula) {
      const firstNode = formula.operationNode;
      const result = new Map([[firstNode.id.toString(), firstNode]]);
      const nodesToParse = [firstNode];
    
      while (nodesToParse.length > 0) {
        const currentNode = nodesToParse.shift();
    
        const objectIds = currentNode.params.filter(p => mongoose.Types.ObjectId.isValid(p));
        if (objectIds.length > 0) {
          const foundNodes = await Node.find({ _id: { $in: objectIds } });
          for (const node of foundNodes) {
            if (!result.has(node.id.toString())) {
              result.set(node.id.toString(), node);
              nodesToParse.push(node);
            }
          }
        }
      }
    
      return Array.from(result.values());
    }

    // функция принимает formula = { operationNode: 1 }, и nodes = [{ id: 1, operation: "operation id", params: ["a", 2]  }, { id: 2 ...}]
    static __getCustomFormulaNodesOrder(formula, nodes) {
      if (!formula) {
        throw new Error(`getCustomFormulaNodesOrder: формула не найдена`);
      }
    
      const firstNode = nodes.find(node => node.id === formula.operationNode);
      const result = new Map([[firstNode.id, firstNode]]);
      const nodesToParse = [firstNode];
    
      while (nodesToParse.length > 0) {
        const currentNode = nodesToParse.shift();
    
        const numberIds = currentNode.params.filter(p => typeof p === 'number');
        if (numberIds.length > 0) {
          const foundNodes = numberIds.map((id) => nodes.find((n) => n.id === id));
          for (const node of foundNodes) {
            if (!result.has(node.id)) {
              result.set(node.id, node);
              nodesToParse.push(node);
            }
          }
        }
      }
    
      return Array.from(result.values());
    }

    static async analyzeFormula(formula, nodes) {
      const firstFormulaNodes = FormulaService.__getCustomFormulaNodesOrder(formula, nodes);
      const formulas = await Formula.find().populate('operationNode')
      const results = []
      for (let i = 0; i < formulas.length; i++) {
        const formula = formulas[i]        
        const secondFomulaNodes = await FormulaService.__getFormulaNodesOrder(formula);
        
        const match = AnalyzeService.analyzeFormulasNodes(firstFormulaNodes, secondFomulaNodes)
        const result = {...match, matchWithFormula: formula._id }
        results.push(result)
      }
      return results
    }
}

module.exports = FormulaService;