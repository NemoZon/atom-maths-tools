import { useState } from "react";
import { Layout, Typography, Input, Button, Spin } from "antd";
import EditArea from "./EditArea";
import LegendModal from "./LegendModal";
import { BlockMath } from "react-katex";
import { useEffect } from "react";
import { replaceParams } from "../tools";
import { useLocation, useNavigate, useParams } from "react-router";
import { analyzeFormula, getFormulas } from "../data/Formula/actions";
import { useDispatch, useSelector } from "react-redux";
import { deleteUserNodeByIndex, patchUserNodeByIndex } from "../data/Node/actions";
import { Operation } from "../data/Operation/model";
import useExpressionFromNode from "../hooks/useExpressionFromNode";
import { createNodesFormula } from "../data/Node/http";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export default function BuilderContent() {
  const dispatch = useDispatch();
  const [operation, setOperation] = useState();
  const { myNodes } = useSelector((state) => state.node);
  const { operations } = useSelector((state) => state.operation);

  const { nodeId = "0" } = useParams(); // Получаем ID ноды из URL
  const navigate = useNavigate();
  const location = useLocation();

  const [node, setNode] = useState({});
  const [params, setParams] = useState([]);
  const [isLegendModalVisible, setIsLegendModalVisible] = useState(false);

  useEffect(() => {
    if (nodeId) {
      const id = Number(nodeId);
      const userNode = myNodes?.[id];
      if (userNode) {
        const paramsTree = myNodes[id].params
          ? myNodes[id].params.map((param) =>
              typeof param === "number" ? myNodes[param] : param
            )
          : [];

        setNode({ ...myNodes[id], params: paramsTree });
      } else {
        navigate(-1); // нету ноды ? редирект назад
      }
    } else {
      setNode(myNodes[0]);
    }
  }, [dispatch, myNodes, navigate, nodeId]);

  useEffect(() => {
    const id = Number(nodeId);
    if (operations.length > 0) {
      const myNodeOperation = operations.find(
        (op) => myNodes[id].operation === op.id
      );
      if (myNodeOperation) {
        setOperation(new Operation(myNodeOperation));
        setParams(
          node.params.map((param) =>
            typeof param === "object"
              ? param.operation && param.params
                ? replaceParams(operations, param)
                : ""
              : param
          )
        );
      } else {
        setOperation();
      }
    }
  }, [myNodes, node.params, nodeId, operations]);

  function cancel() {
    const id = Number(nodeId);
    for (let i = 0; i < myNodes.length; i++) {
      const nodeIndexWithDependency = myNodes.findIndex(
        (node) => node.params && node.params.some((param) => param === id)
      );
      if (nodeIndexWithDependency >= 0) {
        patchUserNodeByIndex(dispatch, nodeIndexWithDependency, {
          params: myNodes[nodeIndexWithDependency].params.map((param) =>
            param === id ? "x" : param
          ),
        });
      }
    }
    deleteUserNodeByIndex(dispatch, id);
    navigate(-1);
  }

  function clear() {
    if (nodeId !== "0") {
      navigate(-1);
    } else {
      navigate(0);
    }
  }

  function save() {
    if (!operation) {
      cancel();
    } else {
      navigate(-1);
    }
  }
  function convertListToDict(data) {
    if (!Array.isArray(data)) {
        throw new TypeError("Input must be an array");
    }

    const result = {};
    data.forEach(item => {
        if ('id' in item) {
            result[item.id] = item;
        }
    });
    return result;
  }
  
  const {isLoading, expression} = useExpressionFromNode(convertListToDict(myNodes), node.id)
  const {expression: mainExpression, isLoading: isMainExpressionLoading} = useExpressionFromNode(convertListToDict(myNodes), 0)
  const [author, setAuthor] = useState('')
  const [legend, setLegend] = useState('')
  const [isCreatingLoading, setIsCreatingLoading] = useState(false)

  async function handleFormulaSave() {
    setIsCreatingLoading(true);
    const validNodes = myNodes.filter(node => typeof node.id !== 'undefined' && node.params && node.operation)

    if (validNodes.length > 0) {
      await createNodesFormula(validNodes, author, legend, mainExpression)
    }
    await getFormulas(dispatch);

    setIsCreatingLoading(false);
    setIsLegendModalVisible(false);
  }
  
  return (
    <Layout style={{ display: "flex", flexDirection: "column" }}>
      <Header style={{ backgroundColor: "#fff", padding: "10px 20px" }}>
        <Title level={3}>Конструктор формул</Title>
      </Header>
      <LegendModal
        isLoading={isCreatingLoading}
        visible={isLegendModalVisible}
        onClose={() => setIsLegendModalVisible(false)}
        onSave={handleFormulaSave}
        legendResult={<BlockMath math={mainExpression} />}
        author={author}
        legend={legend}
        onLegendChange={(e) => setLegend(e.target.value)}
        onAuthorChange={(e) => setAuthor(e.target.value)}
      />
      <Content
        style={{ padding: "20px", overflow: "auto", backgroundColor: "#fff" }}
      >
        {nodeId !== "0" && (
          <div>
            <Title level={4}>
              Основная формула
            </Title>
            <div
              style={{
                border: "1px solid #d9d9d9",
                borderRadius: "4px",
                padding: "10px",
                marginBottom: "20px",
              }}
            >
              {isMainExpressionLoading && <Spin />}
              {mainExpression ? (
                <BlockMath math={mainExpression} />
              ) : (
                <Text type="secondary">*формула в формате текста*</Text>
              )}
            </div>
          </div>
        )}

        <div>
          <Title level={4}>
            {location.state
              ? `Формула для параметра ${location.state}`
              : "Основная формула"}
          </Title>
          <div
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: "4px",
              padding: "10px",
              marginBottom: "20px",
            }}
          >
            {isLoading && <Spin />}
            {operations.length > 0 && node.params && node.operation ? (
              <BlockMath math={expression} />
            ) : (
              <Text type="secondary">*формула в формате текста*</Text>
            )}
          </div>
          <EditArea
            nodeId={nodeId}
            operation={operation}
            setOperation={setOperation}
            params={params}
            setParams={setParams}
          />
          <div>
            {nodeId !== "0" && (
              <Button
                style={{ color: "red", marginTop: "8px" }}
                onClick={cancel}
              >
                Отменить
              </Button>
            )}

            {nodeId !== "0" && (
              <Button
                style={{ color: "green", marginTop: "8px" }}
                onClick={save}
              >
                Сохранить
              </Button>
            )}
          </div>
          <Button
            style={{
              color: "red",
              marginTop: "8px",
              marginLeft: "auto",
              display: "block",
            }}
            onClick={clear}
          >
            Очистить
          </Button>

          <div style={{ marginTop: "20px" }}>
            <Input.TextArea
              placeholder="Тут будет отображаться latex синтаксис данной формулы"
              value={expression}
              readOnly
              rows={4}
            />
          </div>
        </div>
        <Button
          style={{ color: "blue", marginTop: "8px" }}
          onClick={() => {
            analyzeFormula(dispatch, {nodes: myNodes, formula: {operationNode: myNodes[0].id}});
          }}
        >
          Найти совпадения
        </Button>
        {Boolean(expression.length) && (
          <Button
            style={{ color: "green", margin: "8px 0 0 5px" }}
            onClick={() => setIsLegendModalVisible(true)}
          >
            Сохранить формулу
          </Button>
        )}
      </Content>
    </Layout>
  );
}
