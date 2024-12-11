import { useMemo, useState } from "react";
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
  const { operations } = useSelector(state => state.operation)  

  const { nodeId = '0' } = useParams(); // Получаем ID ноды из URL
  const navigate = useNavigate();
  const location = useLocation();
  
  const [node, setNode] = useState({});
  const [params, setParams] = useState([]);
  
  useEffect(() => {
    if (nodeId) {
      const id = Number(nodeId)
      const userNode = myNodes?.[id]
      if (userNode) {
        const paramsTree = myNodes[id].params ? myNodes[id].params.map((param) => typeof param === 'number' ? myNodes[param] : param) : [];
        console.log('{...myNodes[id], params: paramsTree}', {...myNodes[id], params: paramsTree});
        
        setNode({...myNodes[id], params: paramsTree});
      } else {
        navigate(-1) // нету ноды ? редирект назад
      }
    } else {
      setNode(myNodes[0]);
    }
  }, [dispatch, myNodes, navigate, nodeId])

  // function save() {

  // }

  const expression = useMemo(() => {
    if (operations.length > 0 && node.params && node.operation) {
      return replaceParams(operations, node)
    }
    return ''
  }, [operations, node])

  return (
    <Layout style={{ display: "flex", flexDirection: "column" }}>
      <Header style={{ backgroundColor: "#fff", padding: "10px 20px" }}>
        <Title level={3}>Конструктор формул</Title>
      </Header>
      <Content style={{ padding: "20px", overflow: "auto", backgroundColor: "#fff"}}>
        <div>
          <Title level={4}>{location.state ? `Формула для параметра ${location.state}` : 'Основная формула'}</Title>
          <div
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: "4px",
              padding: "10px",
              marginBottom: "20px",
            }}
          >
            {operations.length > 0 && node.params && node.operation ? 
              <BlockMath math={expression} /> : 
              <Text type="secondary">*формула в формате текста*</Text>
            }
          </div>

          <EditArea nodeId={nodeId} operation={operation} setOperation={setOperation} params={params} setParams={setParams} />
          
          <div>
            {/* TODO: добавить удаление ноды на кнопку */}
            {nodeId !== '0' && <Button style={{ color: 'red', marginTop: '8px' }} onClick={() => navigate(-1)}>
              Отменить
            </Button>}

            {nodeId !== '0' && <Button style={{ color: 'green', marginTop: '8px' }} onClick={() => navigate(-1)}>
              Сохранить
            </Button>}
          </div>


          <div style={{ marginTop: "20px" }}>
            <Input.TextArea
              placeholder="Тут будет отображаться latex синтаксис данной формулы"
              value={expression}
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
