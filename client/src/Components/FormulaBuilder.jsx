import { Layout } from "antd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import OperationBlockList from "./OperationBlockList";
import FormulaList from "./FormulaList";
import BuilderContent from "./BuilderContent";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getFormulas } from "../data/Formula/actions";
import { setUserNodes } from "../data/Node/actions";
import { getNodesFromFormula } from "../tools";

const { Content } = Layout;

// Основной компонент приложения
export const FormulaBuilder = () => {
  const dispatch = useDispatch();
  const { formulas } = useSelector(state => state.formula);
  const { nodes } = useSelector(state => state.node);

  useEffect(() => {        
      getFormulas(dispatch);
  }, [dispatch])

  function handleFormulaClick(formula) {
    // Запрашиваем подтверждение у пользователя
    const isConfirmed = window.confirm("Вы уверены, что хотите заменить текущую формулу на выбранную?");
  
    // Если пользователь нажал "OK"
    if (isConfirmed) {
      const newUserNodes = getNodesFromFormula(nodes, formula);
      setUserNodes(dispatch, newUserNodes);
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Layout style={{ minHeight: "100vh", display: 'flex' }}>
        <OperationBlockList />
        <BuilderContent />
        <Layout style={{ height: '100vh', flex: "none", width: 450, overflow: 'auto' }}>
          <Content>
            <FormulaList formulas={formulas} onFormulaClick={handleFormulaClick} />
          </Content>
        </Layout>
      </Layout>
    </DndProvider>
  );
};
