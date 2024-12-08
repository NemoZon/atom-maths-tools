import { Node } from "./model";
import axiosInstance from "../axios";

const endpoint = '/node';

async function getNodes(id, params, formulaId, operationId) {
    try {
        const filter = [];
        if (params) filter.push(`params=${params}`)
        if (formulaId) filter.push(`formulaId=${formulaId}`)
        if (operationId) filter.push(`operationId=${operationId}`)
        if (id) filter.push(`id=${id}`)

        const response = await axiosInstance.get(`${endpoint}/?${filter.join('&')}`)
        if (response.status === 200) {
            return { nodes: response.data.nodes.map((node) => new Node(node)) }
        } else {
            return { error: response.data.error }
        }
    } catch (error) {
        console.error(error);
        return { error }
    }
}

async function createNode(params, formulaId, operationId) {
    try {
        if (!params.every((param) => typeof param === 'string')) {
            throw new Error(`createNode: params must be a list of strings. But it's ${params}`)
        }
        if (typeof formulaId !== 'string') {
            throw new Error(`createNode: formulaId must be a string. But it's ${formulaId}`)
        }
        if (typeof operationId !== 'string') {
            throw new Error(`createNode: operationId must be a string. But it's ${operationId}`)
        }
        const response = await axiosInstance.post(`${endpoint}/`, { params, formulaId, operationId })
        if (response.status === 200) {
            return { node: new Node(response.data.node) }
        } else {
            return { error: response.data.error }
        }
    } catch (error) {
        console.error(error);
        return { error }
    }
}

export { getNodes, createNode }