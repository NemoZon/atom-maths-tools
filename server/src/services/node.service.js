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
}

module.exports = NodeService;