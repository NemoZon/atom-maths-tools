import { useDrop } from "react-dnd";
import { Typography } from "antd";
import PropTypes from "prop-types";
import { Operation } from "../data/Operation/model";
const { Text } = Typography;

export default function EditArea({ operation, setOperation }) {
    const [, drop] = useDrop(() => ({
        accept: "BLOCK",
        drop: (item) => {            
            setOperation(item);
        },
    }));
    

    return (
        <div
            ref={drop}
            style={{
            minHeight: "150px",
            display: 'flex',
            flex: 1,
            border: "2px dashed #d9d9d9",
            borderRadius: "4px",
            padding: "10px",
            textAlign: "center",
            }}
        >
            <Text type="secondary">
            {operation?.latexExpression || "Перетаскивайте блоки для построения формулы"}
            </Text>
        </div>
    );
}

EditArea.propTypes = {
    operation: PropTypes.instanceOf(Operation),
    setOperation: PropTypes.func.isRequired,
};