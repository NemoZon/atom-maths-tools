import { useEffect } from 'react'
import FormulaView from './FormulaView'
import { List } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { Formula } from '../data/Formula/model'
import { getFormulas } from '../data/Formula/actions'
import { Typography } from 'antd';

const { Text } = Typography;

export default function FormulaList() {
    const dispatch = useDispatch();
    const { formulas } = useSelector(state => state.formula);
    useEffect(() => {        
        getFormulas(dispatch);
    }, [dispatch])

    return (
        <List
					style={{ backgroundColor: 'white', width: 450 }}
					header={<div>
            <h2>Список формул</h2>
            <Text type="secondary">Найдено: {formulas.length}</Text>
          </div>}
					bordered
					dataSource={formulas}
					renderItem={(formula) => (
          <List.Item key={formula.id}>
            <FormulaView formula={new Formula(formula)} />
          </List.Item>
        )}
      />
    )
}
