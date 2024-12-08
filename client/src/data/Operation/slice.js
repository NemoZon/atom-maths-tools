import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loading: false,
  error: null,
	operations: [],
}

export const operationSlice = createSlice({
  name: 'operation',
  initialState,
  reducers: {
    setOperations: (state, action) => {
      state.operations = action.payload
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
export const { setOperations, setLoading, setError } = operationSlice.actions

export default operationSlice.reducer