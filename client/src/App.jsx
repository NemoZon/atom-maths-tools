import {FormulaBuilder} from './Components/FormulaBuilder.jsx'
import { Routes, Route, Navigate } from "react-router";

function App() {
  
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/0" replace />} />
      <Route path="/:nodeId" element={<FormulaBuilder />} />
    </Routes>
  )
}

export default App
