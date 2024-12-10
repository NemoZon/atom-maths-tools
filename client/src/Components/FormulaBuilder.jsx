import { Layout } from "antd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import OperationBlockList from "./OperationBlockList";
import FormulaList from "./FormulaList";
import BuilderContent from "./BuilderContent";

const { Content } = Layout;

// Основной компонент приложения
export const FormulaBuilder = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Layout style={{ minHeight: "100vh", display: 'flex' }}>
        <OperationBlockList />
        <BuilderContent />
        <Layout style={{ height: '100vh', flex: "none", width: 450, overflow: 'auto' }}>
          <Content>
            <FormulaList />
          </Content>
        </Layout>
      </Layout>
    </DndProvider>
  );
};
