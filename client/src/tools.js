export function replaceParams(operation, node) {  
  return operation.latexExpression.replace(/\$\{(\w+)\}/g, (_, param) => {
    const index = operation.params.indexOf(param);
    return index !== -1 ? node.params[index] : `\\$\{${param}\\}`;
  });
};