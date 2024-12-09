export class Node {
    constructor({_id, id, formula, params, operation}) {
        this.id = _id || id;
        this.formula = formula;
        this.params = params;
        this.operation = operation;
    }
}