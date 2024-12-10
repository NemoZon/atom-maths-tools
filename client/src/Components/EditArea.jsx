import { useDrop } from "react-dnd";
import { Typography } from "antd";
import PropTypes from "prop-types";
import { Operation } from "../data/Operation/model";
import { useEffect } from "react";
const { Text } = Typography;
import { Input, Button } from 'antd';

export default function EditArea({ operation, setOperation, params, setParams }) {
    const [, drop] = useDrop(() => ({
        accept: "BLOCK",
        drop: (item) => {            
            setOperation(item);
        },
    }));

    useEffect(() => {
        if (operation) {
            setParams(operation.params)
        }
    }, [operation, setParams])
    
    function handleInputChange(value, paramIndex) {
        setParams((prev) =>
            prev.map((param, index) =>
                index === paramIndex ? value : param
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
                        {params.map((param, index) => (
                            <div  key={index}  style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 5,
                                alignItems: 'start',
                            }}>
                                <Button onClick={() => {console.log("clcik")}} type="text" size="small">
                                    <span style={{ color: '#2F72FF' }}>
                                        Изменить на операцию
                                    </span>
                                </Button>  
                                <Input
                                    prefix={<Text type="secondary"><i>{operation.params[index]}:</i></Text>}
                                    type="text" 
                                    value={param} 
                                    onChange={(e) => handleInputChange(e.target.value, index)} 
                                />
                            </div>
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
    params: PropTypes.arrayOf(PropTypes.string).isRequired,
    setParams: PropTypes.func,
};