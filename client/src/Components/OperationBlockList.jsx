import { Layout, Typography } from "antd";
import OperationBlock from "./OperationBlock";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getOperations } from "../data/Operation/actions";
import { Operation } from "../data/Operation/model";

const { Sider } = Layout;
const { Title } = Typography;

export default function OperationBlockList() {
  const dispatch = useDispatch();
  const { operations } = useSelector(state => state.operation)

  useEffect(() => {
    getOperations(dispatch);
  }, [dispatch])

  return (
    <Sider width={300} style={{ backgroundColor: "#464646", padding: "20px" }}>
        <Title style={{color: 'white'}} level={4}>Блоки формул</Title>
        {operations.map((operation) => (
          <OperationBlock key={operation.id} operation={new Operation(operation)} />
        ))}
    </Sider>
  )
}
