import { configureStore } from '@reduxjs/toolkit'
import operationReducer from './Operation/slice'
import nodeReducer from './Node/slice'
import formulaReducer from './Formula/slice'

export const store = configureStore({
  reducer: {
    operation: operationReducer,
    node: nodeReducer,
    formula: formulaReducer,
  },
})