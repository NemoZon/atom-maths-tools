import {FormulaBuilder} from './Components/FormulaBuilder.jsx'
import { Routes, Route } from "react-router";

function App() {
  
  return (
    <Routes>
      <Route path="/:nodeId?" element={<FormulaBuilder />} />
    </Routes>
  )
}

export default App
