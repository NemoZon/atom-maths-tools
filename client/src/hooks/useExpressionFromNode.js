import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOperations } from "../data/Operation/actions";
import { getNodes } from "../data/Node/actions";

function replaceParams(operation, node) {  
  return operation.latexExpression.replace(/\$\{(\w+)\}/g, (_, param) => {
    const index = operation.params.indexOf(param);
    return index !== -1 ? node.params[index] : `\\$\{${param}\\}`;
  });
};

export function useExpressionFromNode(nodeId) {
  const [isLoading, setIsLoading] = useState(false)
  const [expression, setExpression] = useState('');
  const { operations } = useSelector(state => state.operation)
  const { nodes } = useSelector(state => state.node)
  const dispatch = useDispatch()

  // получаем данные, если еще этого не сделали
  useEffect(() => {    
    if (operations.length === 0) {
      setIsLoading(true)
      getOperations(dispatch).finally(() => setIsLoading(false))
    }
    if (Object.keys(nodes).length === 0) {
      setIsLoading(true)
      getNodes(dispatch).finally(() => setIsLoading(false))
    }
  }, [])

  // рекурсивная функция для получения latexExpression из нод
  const getExpressionFromNode = useCallback((nodeId) => {
    const node = nodes[nodeId];
    if (!node) return '';
  
    const operation = operations.find(op => op.id === node.operation);
    if (!operation) return '';
  
    // Заменяем параметры, рекурсивно обрабатывая дочерние узлы
    const resolvedParams = node.params.map(param => {
      return nodes[param] ? getExpressionFromNode(param) : param;
    });
  
    // Создаем новый объект node с заменёнными параметрами
    const resolvedNode = { ...node, params: resolvedParams };
  
    
    return replaceParams(operation, resolvedNode);
  }, [nodes, operations])
  

  // если все данные доступны, получаем latexExpression из всех нод формулы
  useEffect(() => {
    if (operations.length > 0 && Object.keys(nodes).length > 0 && !expression) {      
      setIsLoading(true)
      setExpression(getExpressionFromNode(nodeId))
      setIsLoading(false)
    }
  }, [operations, nodeId, expression, nodes, getExpressionFromNode])


  return { isLoading, expression }
}