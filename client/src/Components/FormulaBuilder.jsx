import { useState } from "react";
import { Layout, Typography, Input } from "antd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import OperationBlockList from "./OperationBlockList";
import EditArea from "./EditArea";
import FormulaList from "./FormulaList";
import { BlockMath } from "react-katex";
import { useEffect } from "react";
import { Node } from "../data/Node/model";
import { replaceParams } from "../tools";

const { Header, Content } = Layout;
const { Title, Text } = Typography;


// Основной компонент приложения
export const FormulaBuilder = () => {
  const [operation, setOperation] = useState();
  const [node, setNode] = useState();

  useEffect(() => {
    // добавить: params будет использоваться для инпутов
    if (operation) 
      setNode(new Node({ params: operation.params, operation: operation.id }))
  }, [operation])
  
  return (
    <DndProvider backend={HTML5Backend}>
      <Layout style={{ minHeight: "100vh", display: 'flex' }}>
        <OperationBlockList />
        <Layout style={{ display: "flex", flexDirection: "column" }}>
          <Header style={{ backgroundColor: "#fff", padding: "10px 20px" }}>
            <Title level={3}>Конструктор формул</Title>
          </Header>

          <Content style={{ padding: "20px", overflow: "auto", backgroundColor: "#fff"}}>
            <div>
              <Title level={4}>Основная формула</Title>
              <div
                style={{
                  border: "1px solid #d9d9d9",
                  borderRadius: "4px",
                  padding: "10px",
                  marginBottom: "20px",
                }}
              >
                {operation && node ? <BlockMath math={replaceParams(operation, node)} /> : <Text type="secondary">*формула в формате текста*</Text>}
              </div>

              <EditArea operation={operation} setOperation={setOperation} />

              <div style={{ marginTop: "20px" }}>
                <Input.TextArea
                  placeholder="Тут будет отображаться latex синтаксис данной формулы"
                  value={operation && node && replaceParams(operation, node)}
                  readOnly
                  rows={4}
                />
              </div>
            </div>
          </Content>
        </Layout>
        <Layout style={{ height: '100vh', flex: "none", width: 450, overflow: 'auto' }}>
          <Content>
            <FormulaList />
          </Content>
        </Layout>
      </Layout>
    </DndProvider>
  );
};
