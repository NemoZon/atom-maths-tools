import { useState } from "react";
import { Layout, Typography, Input, Button } from "antd";
import EditArea from "./EditArea";
import { BlockMath } from "react-katex";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Node } from "../data/Node/model";
import { replaceParams } from "../tools";
import { useLocation, useNavigate, useParams } from "react-router";
import { analyzeFormula } from "../data/Formula/actions";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export default function BuilderContent() {
  const [operation, setOperation] = useState();
  const [node, setNode] = useState({});
  const dispatch = useDispatch();

  const { nodeId } = useParams(); // Получаем ID ноды из URL
  const navigate = useNavigate();
  const location = useLocation();

  // params будет использоваться для инпутов
  // [{ name: operation.params[0], value: '' }]
  const [params, setParams] = useState([]);

  useEffect(() => {
    if (operation) {
      setNode(new Node({ params: operation.params, operation: operation.id }))
    }
  }, [operation])

  useEffect(() => {
    setNode(prev => ({...prev, params}))
  }, [params])

  return (
    <Layout style={{ display: "flex", flexDirection: "column" }}>
      <Header style={{ backgroundColor: "#fff", padding: "10px 20px" }}>
        <Title level={3}>Конструктор формул</Title>
      </Header>
      <Content style={{ padding: "20px", overflow: "auto", backgroundColor: "#fff"}}>
        <div>
          <Title level={4}>Основная формула {location.state}</Title>
          <div
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: "4px",
              padding: "10px",
              marginBottom: "20px",
            }}
          >
            {operation && node ? 
              <BlockMath math={replaceParams(operation, node)} /> : 
              <Text type="secondary">*формула в формате текста*</Text>
            }
          </div>

          <EditArea operation={operation} setOperation={setOperation} params={params} setParams={setParams} />
          
          {nodeId && <Button style={{ color: 'red', marginTop: '8px' }} onClick={() => navigate(-1)}>
            Отменить
          </Button>}

          <div style={{ marginTop: "20px" }}>
            <Input.TextArea
              placeholder="Тут будет отображаться latex синтаксис данной формулы"
              value={operation && node && replaceParams(operation, node)}
              readOnly
              rows={4}
            />
          </div>
        </div>
        <Button style={{ color: 'blue', marginTop: '8px' }} onClick={() => {analyzeFormula(dispatch)}}>
          Найти совпадения
        </Button>
      </Content>
  </Layout>
  )
}
