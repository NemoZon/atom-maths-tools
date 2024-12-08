import { create, get } from "./http";
import { addNode, setError, setLoading, setNodes } from "./slice";

async function getNodes(dispatch, ...args) {
    dispatch(setLoading(true))
    const { nodes, error } = await get(...args);
    if (error) {
        dispatch(setError(error))
    } else {
        const payload = nodes.map(node => ({
            id: node.id,
            formula: node.formula,
            params: node.params,
            operation: node.operation,
        }));
        dispatch(setNodes(payload))
    }
    dispatch(setLoading(false))
}

async function createNode(dispatch, ...args) {
    dispatch(setLoading(true))
    const { node, error } = await create(...args);
    if (error) {
        dispatch(setError(error))
    } else {
        const payload = {
            id: node.id,
            formula: node.formula,
            params: node.params,
            operation: node.operation,
        };
        dispatch(addNode(payload))
    }
    dispatch(setLoading(false))
}

export { getNodes, createNode }