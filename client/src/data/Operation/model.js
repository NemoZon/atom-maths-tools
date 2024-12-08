export class Operation {
    constructor({_id, name, params, latexExpression}) {
        this.id = _id;
        this.name = name;
        this.params = params;
        this.latexExpression = latexExpression;
    }
}