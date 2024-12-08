import { Operation } from "./model";
import axiosInstance from "../axios";

const endpoint = '/operation';

async function get(name, id) {
    try {
        const filter = [];
        if (name) filter.push(`name=${name}`)
        if (id) filter.push(`id=${id}`)

        const response = await axiosInstance.get(`${endpoint}/?${filter.join('&')}`)
        if (response.status === 200) {
            return { operations: response.data.operations.map((operation) => new Operation(operation)) }
        } else {
            return { error: response.data.error }
        }
    } catch (error) {
        console.error(error);
        return { error }
    }
}

export { get }