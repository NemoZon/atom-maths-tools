export function replaceParams(operations, node) {
  // Найти операцию по id
  const operation = operations.find(op => op.id === node.operation);

  if (!operation) {
    throw new Error(`Operation with id ${node.operation} not found.`);
  }

  // Рекурсивная замена параметров
  const parseParam = param => {
    if (typeof param === 'object' && param.operation) {
      return replaceParams(operations, param);
    }
    return param;
  };

  // Заменить параметры
  return operation.latexExpression.replace(/\$\{(\w+)\}/g, (_, param) => {
    const index = operation.params.indexOf(param);
    if (index !== -1) {
      return parseParam(node.params[index]);
    }
    return `\\$\{${param}\\}`;
  });
};

export function isValidObjectId(id) {
  return /^[a-fA-F0-9]{24}$/.test(id);
}

export function convertListToDict(data) {
  if (!Array.isArray(data)) {
      return {};
  }

  const result = {};
  data.forEach(item => {
      if ('id' in item) {
          result[item.id] = item;
      }
  });
  return result;
}

export function getExpressionFromNode(nodes, nodeId, operations) {
  function resolveExpression(nodeId) {
    if (typeof nodeId === 'string' && !isValidObjectId(nodeId)) return nodeId;

    const node = nodes[nodeId];
    if (!node || !node.params || !node.operation) return '';

    // Рекурсивно обрабатываем параметры
    const resolvedParams = node.params.map(param => {
      return nodes[param] ? resolveExpression(param) : param;
    });

    const resolvedNode = { ...node, params: resolvedParams };
    return replaceParams(operations, resolvedNode);
  }
  const result = resolveExpression(nodeId)
  
  return result;
} 