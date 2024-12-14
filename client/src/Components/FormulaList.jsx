import FormulaView from './FormulaView'
import { List } from 'antd'
import { Formula } from '../data/Formula/model'
import { Typography } from 'antd';

const { Text } = Typography;

export default function FormulaList({title = 'Список формул', formulas = [], match = [], onFormulaClick}) {
    return (
        <List
					style={{ backgroundColor: 'white', width: 450 }}
					header={<div>
            <h2>{title}</h2>
            <Text type="secondary">Найдено: {formulas.length}</Text>
          </div>}
					bordered
					dataSource={formulas}
					renderItem={(formula) => {
            const formulaMatch = match.find(m => m.matchWithFormula === formula.id)
            const handleClick = onFormulaClick ? () => onFormulaClick(formula, formulaMatch) : undefined
            return (
              <List.Item key={formula.id}>
                <FormulaView formula={new Formula(formula)} onClick={handleClick} matchPercent={formulaMatch?.percentage || undefined} />
              </List.Item>
            )
          }}
      />
    )
}
