import { create, get, analyze } from "./http";
import { Formula } from "./model";
import { addFormula, setError, setLoading, setFormulas, setMyFormula, setMatch } from "./slice";

async function getFormulas(dispatch, ...args) {
    dispatch(setLoading(true))
    const { formulas, error } = await get(...args);
    if (error) {
        dispatch(setError(error))
    } else {
        const payload = formulas.map(formula => ({
            id: formula.id,
            author: formula.author,
            legend: formula.legend,
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

async function setUserFormula(dispatch, ...args) {
    const formula = new Formula({ ...args })
    const payload = {
        id: formula.id,
        author: formula.author,
        legend: formula.legend,
        latexExpression: formula.latexExpression,
        operationNode: formula.operationNode,
    }
    dispatch(setMyFormula(payload))
}

async function analyzeFormula(dispatch, ...args) {
    dispatch(setLoading(true))
    const { match, error } = await analyze(...args);
    if (error) {
        dispatch(setError(error))
    } else {
        dispatch(setMatch(match))
    }
    dispatch(setLoading(false))
}

export { getFormulas, createFormula, analyzeFormula, setUserFormula }