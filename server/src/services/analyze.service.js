const { default: mongoose } = require("mongoose");

class AnalyzeService {
  static __compareNodesOperation(firstFormulaNodes, secondFormulaNodes) {
    // Функция для сравнения двух параметров, если они являются строками, то они равны
    function compareParams(param1, param2) {
      if (typeof param1 === "string" || typeof param2 === "string") {
        return true; // Строки считаются одинаковыми
      }
      // Если один из параметров не строка, сравниваем их как объекты (операции)
      if (param1 && param2 && param1.operation && param2.operation) {
        return AnalyzeService.__compareNodesOperation([param1], [param2]).length > 0; // Рекурсивное сравнение операций
      }
  
      return false; // В других случаях считаем параметры различными
    }
  
    // Функция для поиска совпадений между двумя узлами
    function compareNodes(firstNode, secondNode) {
      const operationOne = firstNode.operation?.toString() || firstNode.operation
      const operationTwo = secondNode.operation?.toString() || secondNode.operation
      
      if (operationOne !== operationTwo) {
        return false; // Операции должны совпадать
      }
  
      // Если операции совпадают, проверяем параметры
      if (firstNode.params.length !== secondNode.params.length) {
        return false; // Количество параметров должно совпадать
      }
  
      for (let i = 0; i < firstNode.params.length; i++) {
        if (!compareParams(firstNode.params[i], secondNode.params[i])) {
          return false; // Если хотя бы один параметр не совпал, возвращаем false
        }
      }
  
      return true; // Все параметры совпали
    }
  
    // Массив для хранения совпадений
    const matches = [];
  
    // Для каждого узла в первом списке ищем совпадения во втором
    for (const firstNode of firstFormulaNodes) {
      for (const secondNode of secondFormulaNodes) {
        if (compareNodes(firstNode, secondNode)) {
          matches.push({ firstNode, secondNode }); // Если узлы совпали, добавляем в массив совпадений
          break; // Переходим к следующему узлу из первого списка
        }
      }
    }
  
    return matches; // Возвращаем все найденные совпадения
  }
  static __calculateMatchScore(firstNode, secondNode, depth = 1) {
    const operationOne = firstNode.operation?.toString() || firstNode.operation
    const operationTwo = secondNode.operation?.toString() || secondNode.operation

    if (
      !firstNode ||
      !secondNode ||
      operationOne !== operationTwo
    ) {
      return 0; // Разные операции — нет совпадения
    }
  
    let score = depth; // Базовое совпадение с учетом глубины
  
    const params1 = firstNode.params || [];
    const params2 = secondNode.params || [];
  
    // Если количество параметров разное, возвращаем минимальный балл
    if (params1.length !== params2.length) {
      return score;
    }
  
    // Сравниваем каждый параметр
    for (let i = 0; i < params1.length; i++) {
      const param1 = params1[i];
      const param2 = params2[i];
  
      if (typeof param1 === "object" && typeof param2 === "object") {
        // Рекурсивное сравнение вложенных узлов
        score += AnalyzeService.__calculateMatchScore(param1, param2, depth + 1);
      } else if (typeof param1 === "string" && typeof param2 === "string") {
        // Совпадение строк — минимальный балл
        score += depth * 0.5;
      }
    }
  
    return score;
  }
  
  // Функция для вычисления максимального возможного балла узла
  static __calculateMaxScore(node, depth = 1) {
    if (!node || !node.params || !node.params.length) {
      return depth; // Листовой узел
    }
    return (
      depth +
      node.params.reduce((sum, param) => {
        if (typeof param === "object") {
          return sum + AnalyzeService.__calculateMaxScore(param, depth + 1);
        }
        return sum + depth * 0.5; // Строки оцениваются минимально
      }, 0)
    );
  }

  static __compareMatches(matches) {
    return matches.map(({ firstNode, secondNode }) => {
      const score = AnalyzeService.__calculateMatchScore(firstNode, secondNode);
      return {
        firstNode,
        secondNode,
        matchPercentage: Math.min(
          (score / AnalyzeService.__calculateMaxScore(firstNode, 1)) * 100,
          100
        ),
      };
    });
  }
  
  static __getTotalPercentageMatch(firstFormulaNodes, results) {
    const maxPointsForNodeMatch = 100 / firstFormulaNodes.length;
    let points = 0;
    for (let i = 0; i < results.length; i++) {
      points += maxPointsForNodeMatch * (results[i].matchPercentage / 100);
    }
    return points;
  }

  static __parseNodes(nodes) {
    const map = new Map(
      nodes.map((node) => {
        const id = node._id?.toString() || node.id?.toString();
        return [id, { ...node }];
      })
    );
  
    function processNode(node) {
      const params = node.params || node._doc.params;
      return {
        ...node,
        params: params.map((param) => {
          const key =
            typeof param === "object" && param
              ? param.toString()
              : param.toString();
          return map.has(key) ? processNode(map.get(key)) : param;
        }),
      };
    }
  
    return nodes.map((node) => processNode(node._doc || node));
  }

  static __flattenNodes(nodes) {
    const visited = new Set();
    const result = [];
  
    function processNode(node) {      
      const id = node.id || node._id
      if (!visited.has(id)) {
        visited.add(id);
        
        const params = node.params || node._doc.params
        const flatNode = {
          ...node,
          params: params.map((param) =>
            typeof param === "object" && (param.id || param._id || param._doc?._id)? (param.id || param._id || param._doc?._id) : param
          ),
        };
        result.push(flatNode);
        params.forEach((param) => {
          if (typeof param === "object" && (param.id || param._id || param._doc?._id)) {
            processNode(param);
          }
        });
      }
    }
  
    nodes.forEach((node) => processNode(node));
    return result;
  }

  static analyzeFormulasNodes(firstFormulaNodes, secondFormulaNodes) {
    const parsedFirstFormulaNodes = AnalyzeService.__parseNodes(firstFormulaNodes)
    const parsedSecondFormulaNodes = AnalyzeService.__parseNodes(secondFormulaNodes)
      
    const firstMatches = AnalyzeService.__compareNodesOperation(
      parsedFirstFormulaNodes,
      parsedSecondFormulaNodes
    );
    const secondMatches = AnalyzeService.__compareNodesOperation(
      parsedFirstFormulaNodes,
      parsedSecondFormulaNodes
    );
  
    const firstResults = AnalyzeService.__compareMatches(firstMatches);
    const secondResults = AnalyzeService.__compareMatches(secondMatches);
  
    const firstPercentage = AnalyzeService.__getTotalPercentageMatch(
      parsedFirstFormulaNodes,
      firstResults
    );
    const secondPercentage = AnalyzeService.__getTotalPercentageMatch(
      parsedSecondFormulaNodes,
      secondResults
    );
  
    const percentage = (firstPercentage + secondPercentage) / 2;
    for (let i = 0; i < firstResults.length; i++) {
      const secondResult = secondResults[i];
      if (secondResult) {
        firstResults[i].matchPercentage =
          (firstResults[i].matchPercentage + secondResult.matchPercentage) / 2;
      }
      firstResults[i].firstNode = AnalyzeService.__flattenNodes([firstResults[i].firstNode]);
      secondResults[i].secondNode = AnalyzeService.__flattenNodes([secondResults[i].secondNode]);
    }
  
    return {
      percentage,
      nodes: firstResults,
    };
  }
}

module.exports = AnalyzeService;
