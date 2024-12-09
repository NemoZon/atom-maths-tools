export class Operation {
    constructor({_id, id, name, params, latexExpression}) {
        this.id = _id || id;
        this.name = name;
        this.params = params;
        this.latexExpression = latexExpression;
    }
}