import { get } from "./http";
import { setError, setLoading, setOperations } from "./slice";

async function getOperations(dispatch, ...args) {
    dispatch(setLoading(true))
    const { operations, error } = await get(...args);
    if (error) {
        dispatch(setError(error))
    } else {
        const payload = operations.map(op => ({
            id: op.id,
            name: op.name,
            params: op.params,
            latexExpression: op.latexExpression,
        }));
        dispatch(setOperations(payload))
    }
    dispatch(setLoading(false))
}

export { getOperations }