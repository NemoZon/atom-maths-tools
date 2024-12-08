const { default: mongoose } = require("mongoose");
const Operation = require("../models/operation.model");

class OperationService {
    static async getOperations({ name, id }) {
        const filter = {};
        if (name) {
            filter.name = { $regex: name, $options: 'i' }
        }
        if (id && mongoose.Types.ObjectId.isValid(id)) {
            filter._id = mongoose.Types.ObjectId(id)
        }
        return await Operation.find(filter);
    }
}

module.exports = OperationService;