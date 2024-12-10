import { useState } from "react";
import { Layout, Typography, Input, Button } from "antd";
import EditArea from "./EditArea";
import { BlockMath } from "react-katex";
import { useEffect } from "react";
import { replaceParams } from "../tools";
import { useLocation, useNavigate, useParams } from "react-router";
import { analyzeFormula } from "../data/Formula/actions";
import { useDispatch, useSelector } from 'react-redux'

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export default function BuilderContent() {
  const dispatch = useDispatch(); 
  const [operation, setOperation] = useState();
  const { myNodes } = useSelector(state => state.node)  

  const { nodeId } = useParams(); // Получаем ID ноды из URL
  const navigate = useNavigate();
  const location = useLocation();
  const [node, setNode] = useState({});
  const [params, setParams] = useState([]);
  
  useEffect(() => {
    if (nodeId) {
      const id = Number(nodeId)
      const userNode = myNodes?.[id]
      if (userNode) {
        setNode(myNodes[id]);
      } else {
        navigate(-1) // нету ноды ? редирект назад
      }
    } else {
      setNode(myNodes[0]);
    }
  }, [dispatch, myNodes, navigate, nodeId])

  return (
    <Layout style={{ display: "flex", flexDirection: "column" }}>
      <Header style={{ backgroundColor: "#fff", padding: "10px 20px" }}>
        <Title level={3}>Конструктор формул</Title>
      </Header>
      <Content style={{ padding: "20px", overflow: "auto", backgroundColor: "#fff"}}>
        <div>
          <Title level={4}>{location.param ? `Формула для параметра ${location.param}` : 'Основная формула'}</Title>
          <div
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: "4px",
              padding: "10px",
              marginBottom: "20px",
            }}
          >
            {operation && node.params ? 
              <BlockMath math={replaceParams(operation, node)} /> : 
              <Text type="secondary">*формула в формате текста*</Text>
            }
          </div>

          <EditArea nodeId={nodeId} operation={operation} setOperation={setOperation} params={params} setParams={setParams} />
          
          {/* TODO: добавить удаление ноды на кнопку */}
          {nodeId && <Button style={{ color: 'red', marginTop: '8px' }} onClick={() => navigate(-1)}>
            Отменить
          </Button>}

          <div style={{ marginTop: "20px" }}>
            <Input.TextArea
              placeholder="Тут будет отображаться latex синтаксис данной формулы"
              value={operation && node.params && replaceParams(operation, node)}
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
