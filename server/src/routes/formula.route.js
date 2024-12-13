const express = require("express");
const { getFormulas, createFormula, analyzeFormula } = require("../services/formula.service");
const AnalyzeService = require("../services/analyze.service");
const FormulaService = require("../services/formula.service");
const FormulaRouter = express.Router();

FormulaRouter.get("/", async (req, res) => {
  try {    
    const formulas = await getFormulas(req.query)
    
    res.status(200).json({ formulas: formulas });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

FormulaRouter.post("/", async (req, res) => {
    try {      
      const formula = await createFormula(req.body)
      
      res.status(200).json({ formula: formula });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

FormulaRouter.post("/analyze", async (req, res) => {
  try {
    // formula: {operationNode: "id стартовой ноды"} 
    // nodes: [{id: Number, operation: String, params: ["a", 2]}]
    // Пример:
    // const formula = { operationNode: 1 }
    // const nodes = [
    //   { id: 1, operation: "675b2fa799b091c5cbcfddd6", params: [3, 2] }, 
    //   { id: 2, operation: "675b2fa799b091c5cbcfddce", params: [4, "a"] }, 
    //   { id: 3, operation: "675b2fa799b091c5cbcfddcd", params: ['b', "a"] }, 
    //   { id: 4, operation: "675b2fa799b091c5cbcfddd1", params: ['b', "a"] }
    // ]
    const { formula, nodes } = req.body;
    const match = await FormulaService.analyzeFormula(formula, nodes)
    
    res.status(200).json({ match });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = FormulaRouter;