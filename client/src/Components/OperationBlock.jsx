import { useDrag } from "react-dnd";
import PropTypes from 'prop-types';
import { Operation } from "../data/Operation/model";

export default function OperationBlock({ operation }) {
    const [, drag] = useDrag(() => ({
        type: "BLOCK",
        item: { code: operation.latexExpression },
    }));
    
    return (
    <div
        ref={drag}
        style={{
            padding: "10px",
            margin: "5px 0",
            backgroundColor: "#FFAD84",
            borderRadius: 10,
            cursor: "grab",
        }}
    >
        {operation.name}
    </div>
    );
}

OperationBlock.propTypes = {
    operation: PropTypes.instanceOf(Operation).isRequired,
};
