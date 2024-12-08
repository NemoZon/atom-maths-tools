const { default: mongoose } = require("mongoose");
const Operation = require("../models/operation.model");

class OperationService {
    static async getOperations({ name, id } = {}) {
        const filter = {};
        if (name) {
            filter.name = { $regex: name, $options: 'i' }
        }
        if (id && mongoose.Types.ObjectId.isValid(id)) {
            filter._id = new mongoose.Types.ObjectId(id)
        }
        const operations = await Operation.find(filter);
        
        return operations;
    }
}

module.exports = OperationService;