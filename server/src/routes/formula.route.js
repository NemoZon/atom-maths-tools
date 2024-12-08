const express = require("express");
const Formula = require("../models/formula.model");
const Node = require("../models/node.model");
const { default: mongoose } = require("mongoose");
const { getFormulas, createFormula } = require("../services/formula.service");
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

module.exports = FormulaRouter;