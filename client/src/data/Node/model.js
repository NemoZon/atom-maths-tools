export class Node {
    constructor({_id, formula, params, operation}) {
        this.id = _id;
        this.formula = formula;
        this.params = params;
        this.operation = operation;
    }
}