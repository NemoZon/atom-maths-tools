import { create, get } from "./http";
import { addMyNode, addNode, deleteMyNodeByIndex, patchMyNodeByIndex, resetMyNodes, setError, setLoading, setNodes } from "./slice";
import { Node } from "./model";

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

function addUserNode(dispatch, userNode) {
    const node = new Node(userNode);
    const payload = {
        id: node.id,
        formula: node.formula,
        params: node.params,
        operation: node.operation,
    }
    dispatch(addMyNode(payload))
    return payload;
}

function deleteUserNodeByIndex(dispatch, index) {
    dispatch(deleteMyNodeByIndex(index))
}

function resetUserNodes(dispatch) {
    dispatch(resetMyNodes())
}

function patchUserNodeByIndex(dispatch, index, userNode) {
    const node = new Node(userNode)
    const payload = {
        index,
        node: {
            id: node.id,
            formula: node.formula,
            params: node.params,
            operation: node.operation,
        },
    }
    console.log('payload.node', payload.node);
    
    dispatch(patchMyNodeByIndex(payload))
}


export { getNodes, createNode, addUserNode, deleteUserNodeByIndex, resetUserNodes, patchUserNodeByIndex }