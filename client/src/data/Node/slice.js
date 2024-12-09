import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loading: false,
  error: null,
  nodes: {},
}

export const nodeSlice = createSlice({
  name: 'nodes',
  initialState,
  reducers: {
    setNodes: (state, action) => {
			const payload = {}
			for (let i = 0; i < action.payload.length; i++) {
				const node = action.payload[i];
				payload[node.id] = node;
			}
      
      state.nodes = payload;
    },
		addNode: (state, action) => {
      state.nodes = {...state.nodes, [action.payload._id]: action.payload};
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setNodes, addNode, setLoading, setError } = nodeSlice.actions

export default nodeSlice.reducer