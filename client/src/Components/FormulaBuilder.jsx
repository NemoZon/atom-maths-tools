import { useState } from "react";
import { Layout, Typography, Input } from "antd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import OperationBlockList from "./OperationBlockList";
import EditArea from "./EditArea";

const { Header, Content } = Layout;
const { Title, Text } = Typography;


// Основной компонент приложения
export const FormulaBuilder = () => {
  const [formula, setFormula] = useState("");

  return (
    <DndProvider backend={HTML5Backend}>
    <Layout style={{ minHeight: "100vh" }}>
      <OperationBlockList />
      <Layout style={{ width: "100%", display: "flex", flexDirection: "column" }}>
        <Header style={{ backgroundColor: "#fff", padding: "10px 20px" }}>
          <Title level={3}>Конструктор формул</Title>
        </Header>

        <Content style={{ flex: 1, padding: "20px", overflow: "auto" }}>
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
              {formula || <Text type="secondary">*формула в формате текста*</Text>}
            </div>

            <EditArea formula={formula} setFormula={setFormula} />

            <div style={{ marginTop: "20px" }}>
              <Input.TextArea
                placeholder="textarea для ввода строки с Latex синтаксисом"
                value={formula}
                readOnly
                rows={4}
              />
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  </DndProvider>
  );
};
