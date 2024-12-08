export class Formula {
    constructor({_id, author, legend, latexExpression, operationNode}) {
        this.id = _id;
        this.author = author;
        this.legend = legend;
        this.latexExpression = latexExpression;
        this.operationNode = operationNode;
    }
}