import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loading: false,
  error: null,
  nodes: {},
  // ноды для создания myFormula, myNodes[0] является энтрипоинт нодой
  // в этой структуре id каждой нодой - ее index
  // * так как каждая нода имеет параметры, и может принимать как id другой ноды, так и любой инпут, важно проверить тип параметра id = Number
  myNodes: [{ id: 0 }],
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
    addMyNode: (state, action) => {
      state.myNodes = [...state.myNodes, action.payload];
    },
    patchMyNodeByIndex: (state, action) => {
      const myNodes = state.myNodes.map((node, index) => {
        if (index === action.payload.index) {
          const id = typeof action.payload.node.id === 'undefined' ? node.id : action.payload.node.id
          const formula = typeof action.payload.node.formula === 'undefined' ? node.formula : action.payload.node.formula
          const params = typeof action.payload.node.params === 'undefined' ? node.params : action.payload.node.params
          const operation = typeof action.payload.node.operation === 'undefined' ? node.operation : action.payload.node.operation
          return { 
            id,
            formula,
            params,
            operation,
          }
        } else {
          return node;
        }
      })
      
      state.myNodes = myNodes;
    },
    deleteMyNodeByIndex: (state, action) => {
      // так как ноды используют index, как id, то удалять ноду из списка нельзя, только заменять 
      state.myNodes = state.myNodes.map((node, index) => index === action.payload ? null : node);
    },
    resetMyNodes: (state) => {
      state.myNodes = [];
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
export const { setNodes, addNode, setLoading, setError, addMyNode, deleteMyNodeByIndex, resetMyNodes, patchMyNodeByIndex } = nodeSlice.actions

export default nodeSlice.reducer