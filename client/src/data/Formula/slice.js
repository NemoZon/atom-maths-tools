import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loading: false,
  error: null,
  formulas: [],
  myFormula: {},
  match: [],
}

export const formulaSlice = createSlice({
  name: 'formula',
  initialState,
  reducers: {
    setFormulas: (state, action) => {
      state.formulas = action.payload;
    },
    setMatch: (state, action) => {
      state.match = action.payload;
    },
    setMyFormula: (state, action) => {
      state.myFormula = action.payload;
    },
	  addFormula: (state, action) => {
      state.formulas = [...state.formulas, action.payload];
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
export const { setFormulas, addFormula, setLoading, setError, setMyFormula, setMatch } = formulaSlice.actions

export default formulaSlice.reducer