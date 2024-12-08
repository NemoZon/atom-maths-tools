const express = require("express");
const { createNode, getNodes } = require("../services/node.service");
const NodeRouter = express.Router();

NodeRouter.get("/", async (req, res) => {
  try {
    const { formulaId, params: paramsJson, operationId } = req.query;
    const params = paramsJson ? JSON.parse(paramsJson) : undefined;


    const nodes = await getNodes({formulaId, params, operationId});
    
    res.status(200).json({ nodes: nodes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

NodeRouter.post("/", async (req, res) => {
    try {
      const { formulaId, params, operationId} = req.body;
      
      const node = await createNode({ formulaId, params, operationId})

      res.status(200).json({ node: node });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

module.exports = NodeRouter;