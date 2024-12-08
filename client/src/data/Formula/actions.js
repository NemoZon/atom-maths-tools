import { create, get } from "./http";
import { addFormula, setError, setLoading, setFormulas } from "./slice";

async function getFormulas(dispatch, ...args) {
    dispatch(setLoading(true))
    const { formulas, error } = await get(...args);
    if (error) {
        dispatch(setError(error))
    } else {
        const payload = formulas.map(formula => ({
            id: formula.id,
            author: formula.formula,
            legend: formula.params,
            latexExpression: formula.latexExpression,
            operationNode: formula.operationNode,
        }));
        dispatch(setFormulas(payload))
    }
    dispatch(setLoading(false))
}

async function createFormula(dispatch, ...args) {
    dispatch(setLoading(true))
    const { formula, error } = await create(...args);
    if (error) {
        dispatch(setError(error))
    } else {
        const payload = {
            id: formula.id,
            author: formula.author,
            legend: formula.legend,
            latexExpression: formula.latexExpression,
            operationNode: formula.operationNode,
        };
        dispatch(addFormula(payload))
    }
    dispatch(setLoading(false))
}

export { getFormulas, createFormula }