import { useDrop } from "react-dnd";
import { Typography } from "antd";
import PropTypes from "prop-types";
const { Text } = Typography;

export default function EditArea({ formula, setFormula }) {
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
            display: 'flex',
            flex: 1,
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
}

EditArea.propTypes = {
    formula: PropTypes.string,
    setFormula: PropTypes.func.isRequired,
};