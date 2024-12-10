import { useDrop } from "react-dnd";
import { Typography } from "antd";
import PropTypes from "prop-types";
import { Operation } from "../data/Operation/model";
import { useEffect, useState } from "react";
const { Text } = Typography;

export default function EditArea({ operation, setOperation }) {
    const [, drop] = useDrop(() => ({
        accept: "BLOCK",
        drop: (item) => {            
            setOperation(item);
        },
    }));

    // [{ name: operation.params[0], value: '' }]
    const [params, setParams] = useState();

    useEffect(() => {
        if (operation) {
            const paramsValue = operation.params.map((param) => ({ name: param, value: '' }))
            setParams(paramsValue)
        }
    }, [operation])
    
    function handleInputChange(value, paramName) {
        setParams((prev) =>
            prev.map((param) =>
                param.name === paramName ? { ...param, value: value } : param // Обновляем только нужный объект
            )
        );
    }    

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
        }}>
            <Text type="secondary">{operation?.name}</Text>
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
                    {!operation && "Перетаскивайте блоки для построения формулы"}
                </Text>
                {params?.length > 0 && (
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: 'space-evenly',
                        gap: 20,
                        flexWrap: "wrap",
                    }}>
                        {params.map((param) => (
                            <label key={param.name} style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'start',
                            }} >
                                <Text>Имя параметра: {param.name}</Text>
                                <input type="text" value={param.value} onChange={(e) => handleInputChange(e.target.value, param.name)} />
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </div>

    );
}

EditArea.propTypes = {
    operation: PropTypes.instanceOf(Operation),
    setOperation: PropTypes.func.isRequired,
};