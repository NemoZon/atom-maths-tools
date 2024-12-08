import React, { useState } from "react";
import { Layout, Typography, Button, Input } from "antd";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

// Моки для блоков формул
const formulaBlocks = [
  { id: "1", label: "корень степени n от x", code: "\\sqrt[n]{x}" },
  { id: "2", label: "дробь с числителем A и знаменателем B", code: "\\frac{A}{B}" },
  { id: "3", label: "интеграл от A до B от функции f(x) по x", code: "\\int_{A}^{B} f(x) dx" },
  { id: "4", label: "логарифм по основанию b от x", code: "\\log_b(x)" },
  { id: "5", label: "x в степени n", code: "x^n" },
];

// Компонент для блока формулы
const FormulaBlock = ({ block }) => {
  const [, drag] = useDrag(() => ({
    type: "BLOCK",
    item: { code: block.code },
  }));

  return (
    <div
      ref={drag}
      style={{
        padding: "10px",
        margin: "5px 0",
        backgroundColor: "#f0f0f0",
        border: "1px solid #d9d9d9",
        cursor: "grab",
      }}
    >
      {block.label}
    </div>
  );
};

// Компонент для зоны редактирования
const EditArea = ({ formula, setFormula }) => {
  const [, drop] = useDrop(() => ({
    accept: "BLOCK",
    drop: (item) => {
      setFormula((prev) => (prev ? `${prev} ${item.code}` : item.code));
    },
  }));

  return (
    <div
      ref={drop}
      style={{
        minHeight: "150px",
        border: "2px dashed #d9d9d9",
        borderRadius: "4px",
        padding: "10px",
        textAlign: "center",
      }}
    >
      <Text type="secondary">
        {formula || "Перетаскивайте блоки для построения формулы"}
      </Text>
    </div>
  );
};

// Основной компонент приложения
export const FormulaBuilder = () => {
  const [formula, setFormula] = useState("");

  return (
    <DndProvider backend={HTML5Backend}>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider width={300} style={{ backgroundColor: "#fff", padding: "20px" }}>
          <Title level={4}>Блоки формул</Title>
          {formulaBlocks.map((block) => (
            <FormulaBlock key={block.id} block={block} />
          ))}
        </Sider>
        <Layout style={{width: '100%'}}>
          <Header style={{ backgroundColor: "#fff", padding: "10px 20px" }}>
            <Title level={3}>Конструктор формул</Title>
          </Header>
          <Content style={{ padding: "20px" }}>
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
              <div>
                <EditArea formula={formula} setFormula={setFormula} />
              </div>
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
