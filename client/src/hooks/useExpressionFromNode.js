import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOperations } from "../data/Operation/actions";
import { replaceParams } from "../tools";

export default function useExpressionFromNode(nodes, nodeId) {
  const [isLoading, setIsLoading] = useState(false)
  const [expression, setExpression] = useState('');
  const { operations } = useSelector(state => state.operation)
  const dispatch = useDispatch()
  
  // получаем данные, если еще этого не сделали
  useEffect(() => {
    if (operations.length === 0) {
      setIsLoading(true)
      getOperations(dispatch).finally(() => setIsLoading(false))
    }
  }, [dispatch, operations.length])

  // рекурсивная функция для получения latexExpression из нод
  const getExpressionFromNode = useCallback((nodeId) => {
    const node = nodes[nodeId];
    
    if (!node || !node.params || !node.operation) return '';
  
    // Заменяем параметры, рекурсивно обрабатывая дочерние узлы
    const resolvedParams = node.params.map(param => {
      return nodes[param] ? getExpressionFromNode(param) : param;
    });
  
    // Создаем новый объект node с заменёнными параметрами
    const resolvedNode = { ...node, params: resolvedParams };
  
    
    return replaceParams(operations, resolvedNode);
  }, [nodes, operations])
  

  // если все данные доступны, получаем latexExpression из всех нод формулы
  useEffect(() => {    
    if (operations.length > 0 && Object.keys(nodes).length > 0) {      
      setIsLoading(true)
      setExpression(getExpressionFromNode(nodeId))
      setIsLoading(false)
    }
  }, [operations, nodeId, expression, nodes, getExpressionFromNode])


  return { isLoading, expression }
}