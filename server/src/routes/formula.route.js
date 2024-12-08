const express = require("express");
const Formula = require("../models/formula.model");
const Node = require("../models/node.model");
const FormulaRouter = express.Router();

FormulaRouter.get("/", async (req, res) => {
  try {
    const { author } = req.query;
    
    const filter = {};
    if (author) {
        filter.author = { $regex: author, $options: 'i' }
    }

    const formulas = await Formula.find(filter);
    
    res.status(200).json({ formulas: formulas });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

FormulaRouter.post("/", async (req, res) => {
    try {
      const { nodeId, author, legend, latexExpression } = req.body;
      
      const node = await Node.findById(nodeId)

      if (!node) {
        throw new Error(`POST formula/: node с id ${nodeId} не найдено`)
      }

      const formula = await Formula.create({ author, legend, latexExpression, operationNode: nodeId });
      
      res.status(200).json({ formula: formula });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

module.exports = FormulaRouter;