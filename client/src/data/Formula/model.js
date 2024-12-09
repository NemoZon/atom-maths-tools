export class Formula {
    constructor({_id, id, author, legend, latexExpression, operationNode}) {
        this.id = _id || id;
        this.author = author;
        this.legend = legend;
        this.latexExpression = latexExpression;
        this.operationNode = operationNode;
    }
}