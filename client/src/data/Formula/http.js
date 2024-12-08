import { Formula } from "./model";
import axiosInstance from "../axios";

const endpoint = '/formula';

async function getFormulas(id, author, latexExpression, legend, operationNodeId) {
    try {
        const filter = [];
        if (author) filter.push(`author=${author}`)
        if (latexExpression) filter.push(`latexExpression=${latexExpression}`)
        if (legend) filter.push(`legend=${legend}`)
        if (operationNodeId) filter.push(`operationNodeId=${operationNodeId}`)
        if (id) filter.push(`id=${id}`)

        const response = await axiosInstance.get(`${endpoint}/?${filter.join('&')}`)
        if (response.status === 200) {
            return { formulas: response.data.formulas.map((formula) => new Formula(formula)) }
        } else {
            return { error: response.data.error }
        }
    } catch (error) {
        console.error(error);
        return { error }
    }
}

async function createFormula(nodeId, author, legend, latexExpression) {
    try {
        if (typeof nodeId !== 'string') {
            throw new Error(`createFormula: nodeId must be a string. But it's ${nodeId}`)
        }
        const response = await axiosInstance.post(`${endpoint}/`, { author, latexExpression, legend, nodeId })
        if (response.status === 200) {
            return { formula: new Formula(response.data.formula) }
        } else {
            return { error: response.data.error }
        }
    } catch (error) {
        console.error(error);
        return { error }
    }
}

export { getFormulas, createFormula }