import PropTypes from "prop-types";
import { Formula } from "../data/Formula/model";
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import { Card, Progress, Spin, Typography } from 'antd';
import { useEffect, useState } from "react";
import { useExpressionFromNode } from "../hooks/useExpressionFromNode";

const { Title, Text } = Typography;

export default function FormulaView({ formula, matchPercent, matchPercentLoading = false }) {  

  const [latex, setLatex] = useState(formula.latexExpression)
  const {isLoading, expression} = useExpressionFromNode(formula.operationNode)


  useEffect(() => {
    setLatex(expression);
  }, [expression])

  useEffect(() => {
    if (formula.latexExpression) setLatex(formula.latexExpression)
  }, [formula.latexExpression])

  return (
    <Card style={{ 
        width: 400,
        margin: 20, 
        border: "1px solid #111111",
      }}>
      <Title level={4}>Формула</Title>
      <div style={{ fontSize: '18px', marginBottom: '16px' }}>
        {(isLoading && !latex) ? (
          <Spin size="large" />
        ) :  <BlockMath math={latex} />}
      </div>

      <Text strong>Автор:</Text> <Text>{formula.author}</Text>

      <div style={{ margin: '16px 0' }}>
        <Text strong>Процент совпадения:</Text>
        <div>
          {!matchPercentLoading ? (
            matchPercent ?
              <Progress percent={matchPercent} /> :
              <Text>Данных нет</Text>
          ) : (
            <Spin size="large" />
          )}
        </div>
      </div>
      
      {formula.legend && (
        <>
          <Title level={5}>Легенда</Title>
          <Text>{formula.legend}</Text>
        </>
      )}
    </Card>
  );
}

FormulaView.propTypes = {
    formula: PropTypes.instanceOf(Formula).isRequired,
    matchPercent: PropTypes.number,
    matchPercentLoading: PropTypes.bool,
}