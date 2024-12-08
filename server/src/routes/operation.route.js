const express = require("express");
const { getOperations } = require("../services/operation.service");
const OperationRouter = express.Router();

OperationRouter.get("/", async (req, res) => {
  try {    
    const operations = await getOperations(req.query)
    
    res.status(200).json({ operations: operations });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = OperationRouter;