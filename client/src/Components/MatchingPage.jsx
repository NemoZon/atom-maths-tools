import { useDispatch, useSelector } from 'react-redux'
import useExpressionFromNode from '../hooks/useExpressionFromNode';
import { convertListToDict, getExpressionFromNode } from '../tools';
import { Button, Input, Layout, Progress, Spin } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import Title from 'antd/es/typography/Title';
import Text from 'antd/es/typography/Text';
import { BlockMath } from 'react-katex';
import FormulaList from './FormulaList';
import { useNavigate } from 'react-router';
import { useEffect, useMemo, useState } from 'react';
import FormulaView from './FormulaView';
import { getFormulas } from '../data/Formula/actions';
import { getOperations } from '../data/Operation/actions';
import { getNodes } from '../data/Node/actions';

export default function MatchingPage() {
  const { comparedNodes } = useSelector(state => state.node);
  const { formulas, match } = useSelector(state => state.formula);
  const { nodes } = useSelector(state => state.node)
  const { operations } = useSelector(state => state.operation)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  useEffect(() => {
    if (formulas.length === 0) {
      getFormulas(dispatch)
    }
  }, [formulas, dispatch])

  useEffect(() => {
    if (operations.length === 0) {
      getOperations(dispatch)
    }
  }, [operations, dispatch])

  useEffect(() => {
    if (Object.keys(nodes).length === 0) {
      getNodes(dispatch)
    }
  }, [nodes, dispatch])

  const [currentFormula, setCurrentFormula] = useState()
  const [currentMatch, setCurrentMatch] = useState()
  
  const {isLoading, expression} = useExpressionFromNode(convertListToDict(comparedNodes), comparedNodes?.[0]?.id)
  const {expression: currentExpression} = useExpressionFromNode(nodes, currentFormula?.operationNode)


  const matchedFormulas = useMemo(() => {
    return match
      .filter(m => m.percentage > 0)
      .sort((a, b) => b.percentage - a.percentage)  // Сортировка по убыванию
      .map(m => formulas.find(f => f.id === m.matchWithFormula))
      .filter(Boolean);  // Исключает undefined, если формула не найдена
  }, [formulas, match]);
  

  
  if (!comparedNodes) {
    return (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center', alignItems: 'center' }}>
        <Spin />
        <Button style={{ color: 'white' }} type='text' onClick={() => navigate(-1)}>Вернуться назад</Button>
      </div>
    )
  }

  function handleFormulaClick(formula, formulaMatch) {
    setCurrentFormula(formula)
    setCurrentMatch(formulaMatch)
  }

  return (
    <div style={{ display: 'flex' }}>
      <Layout style={{ display: "flex", flexDirection: "column" }}>
        <Header style={{ backgroundColor: "#fff", padding: "10px 20px" }}>
          <Title level={3}>Анализ</Title>
        </Header>
        <Content
          style={{ padding: "20px", overflow: "auto", backgroundColor: "#fff" }}
        >
          <div>
            {!currentFormula && (
              <Title style={{ color: 'gray' }} level={4}>
                Выберете формулу, чтобы узнать детали
              </Title>
            )}
            <div style={{ display: 'flex', gap: 20 }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Title level={4}>
                  Ваша формула
                </Title>
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    fontSize: 18,
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: "1px solid rgb(17, 17, 17)",
                    borderRadius: "8px",
                  }}
                >
                  {isLoading && <Spin />}
                  {expression && (
                    <BlockMath math={expression} />
                  )}
                </div>
              </div>

              { currentFormula && currentMatch && (
                <div style={{ flex: 1 }}>
                  <Title level={4}>
                    Выбранная формула
                  </Title>
                  <FormulaView formula={currentFormula} matchPercent={currentMatch.percentage} />
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 20, marginTop: "20px"}}>
              <div style={{ flex: 1 }}>
                <Input.TextArea
                  placeholder="Тут будет отображаться latex синтаксис вашей формулы"
                  value={expression}
                  readOnly
                  rows={4}
                />
              </div>
              {currentExpression && (
                <div style={{ flex: 1 }}>
                  <Input.TextArea
                    placeholder="Тут будет отображаться latex синтаксис выбранной формулы"
                    value={currentExpression}
                    readOnly
                    rows={4}
                  />
                </div>
              )}
            </div>

            { currentFormula && currentMatch && (
              <div style={{
                flex: 1,
                marginTop: "20px",
                display: 'flex',
                fontSize: 18,
                border: "1px solid rgb(17, 17, 17)",
                flexDirection: 'column',
                padding: 20,
                borderRadius: "8px",
              }}>
                <Text>Анализ основан на следующих совпадениях :</Text>
                {operations.length > 0 && Object.keys(nodes).length > 0 &&  currentMatch.nodes.map((node, index) => (
                  <div key={index} style={{ marginLeft: 10, display: 'flex', flexDirection: 'column', gap: 10, }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <Text strong>{index + 1}{')'} Совпадение {node.matchPercentage.toFixed(2)}%</Text>
                      <Progress style={{ maxWidth: 300, marginLeft: 15 }} percent={node.matchPercentage.toFixed(2)} />
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                      <div style={{
                        display: 'flex',
                        gap: 5,
                        flexDirection: 'column',
                        border: "1px solid rgb(17, 17, 17)",
                        padding: 20,
                        borderRadius: "8px",
                      }}>
                        <Text>Операция из вашей формулы :</Text>
                        <BlockMath math={getExpressionFromNode(comparedNodes, node.firstNode[0].id, operations)} />
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: 5,
                        flexDirection: 'column',
                        border: "1px solid rgb(17, 17, 17)",
                        padding: 20,
                        borderRadius: "8px",
                      }}>
                        <Text>Операция из выбранной формулы</Text>
                        <BlockMath math={getExpressionFromNode(nodes, node.secondNode._id, operations)} />
                      </div>
                    </div>
                  </div>

                ))}
              </div>
            )}

          </div>
        </Content>
      </Layout>
      <Layout style={{ height: '100vh', flex: "none", width: 450, overflow: 'auto' }}>
        <Content>
          <FormulaList title={"Похожие формулы"} formulas={matchedFormulas} onFormulaClick={handleFormulaClick} match={match} />
        </Content>
      </Layout>
    </div>

  )
}
