import { useEffect } from 'react'
import {FormulaBuilder} from './Components/FormulaBuilder.jsx'
import { getFormulas } from './data/Formula/http.js'
import { getNodes } from './data/Node/http.js'
import { getOperations } from './data/Operation/http.js'

function App() {
  useEffect(() => {
    getFormulas().then((res) => console.log(res))
    getNodes().then((res) => console.log(res))
    getOperations().then((res) => console.log(res))
  }, [])
  return (<FormulaBuilder />)
}

export default App
