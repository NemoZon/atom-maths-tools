import { configureStore } from '@reduxjs/toolkit'
import operationReducer from './Operation/slice'

export const store = configureStore({
  reducer: {
    operation: operationReducer,
  },
})