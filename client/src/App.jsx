import {FormulaBuilder} from './Components/FormulaBuilder.jsx'
import { Routes, Route, Navigate } from "react-router";
import MatchingPage from './Components/MatchingPage.jsx';

function App() {
  
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/0" replace />} />
      <Route path="/:nodeId" element={<FormulaBuilder />} />
      <Route path="/analyze" element={<MatchingPage />} />
    </Routes>
  )
}

export default App
