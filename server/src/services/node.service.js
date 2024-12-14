const { default: mongoose } = require("mongoose");
const Node = require("../models/node.model");
const { getOperations } = require("./operation.service");

class NodeService {
    static async getNodes({id, formulaId, params, operationId} = {}) {
        const filter = {};
        if (formulaId && mongoose.Types.ObjectId.isValid(formulaId)) {
            filter.formula = new mongoose.Types.ObjectId(formulaId);
        }
        if (id && mongoose.Types.ObjectId.isValid(id)) {
            filter._id = new mongoose.Types.ObjectId(id);
        }
        if (params) {
            filter.params = { $all: params }; // все совпадения , не зависимо от порядка
        }
        if (operationId && mongoose.Types.ObjectId.isValid(operationId)) {
            filter.operation = new mongoose.Types.ObjectId(operationId)
        }
        return await Node.find(filter);
    }
    static async createNode({ formulaId, params, operationId } = {}) {
        if (!params || params.length === 0) {
            throw new Error('createNode: params не найден или пуст')
        }
        if (!operationId) {
            throw new Error('createNode: operationId не найден')
        }
        const operation = (await getOperations({ id: new mongoose.Types.ObjectId(operationId) }))?.[0]
        
        if (!operation) {
            throw new Error(`createNode: operation с id ${operationId} не найден`)
        }
        if (operation.params.length !== params.length) {
            throw new Error(`createNode: колличество параметров не совпадает operation.params = ${operation.params.length}, а отправлено ${params.length}`)
        }

        return await Node.create({ formula: formulaId, params, operation: operationId })
    }
    static async createNodes(nodes) {
      const createdNodes = new Map();
      const pendingNodes = new Map(nodes.map((node) => [node.id, node]));
    
      while (pendingNodes.size > 0) {
        let createdInThisIteration = false;
    
        for (const [id, node] of pendingNodes) {
          const areParamsReady = node.params.every(
            (param) => typeof param !== "number" || createdNodes.has(param)
          );
    
          if (areParamsReady) {
            // Prepare params with resolved IDs
            const resolvedParams = node.params.map((param) =>
              typeof param === "number" ? createdNodes.get(param) : param
            );

            // Simulate node creation
            const newNode = await Node.create({
              operation: node.operation,
              params: resolvedParams,
            });
    
            createdNodes.set(node.id, newNode.id);
            pendingNodes.delete(id);
            createdInThisIteration = true;
          }
        }
    
        if (!createdInThisIteration) {
          throw new Error("Circular dependency detected or missing dependencies.");
        }
      }
    
      // Identify root node (without dependencies in params)
      const rootNode = nodes.find(
        (node) => !nodes.some((otherNode) => otherNode.params.includes(node.id))
      );
    
      return {
        createdIds: Array.from(createdNodes.values()),
        rootNodeId: rootNode ? createdNodes.get(rootNode.id) : [...createdNodes.values()].at(-1),
      };
    }
}

module.exports = NodeService;