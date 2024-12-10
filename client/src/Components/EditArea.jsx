import { useDrop } from "react-dnd";
import { Typography } from "antd";
import PropTypes from "prop-types";
import { Operation } from "../data/Operation/model";
import { useEffect } from "react";
const { Text } = Typography;
import { Input, Button } from 'antd';
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { addUserNode, patchUserNodeByIndex } from "../data/Node/actions";

export default function EditArea({ nodeId, operation, setOperation, params, setParams }) {
    const navigate = useNavigate();
    const { myNodes } = useSelector(state => state.node);

    const [, drop] = useDrop(() => ({
        accept: "BLOCK",
        drop: (item) => {                     
            setOperation(item);
        },
    }));

    console.log('EditArea nodeId', nodeId);

    

    const dispatch = useDispatch();
    useEffect(() => {
        if (operation) {
            const id = Number(nodeId || 0)
            setParams(operation.params)
            patchUserNodeByIndex(dispatch, id, { 
                operation: operation.id,
                params: operation.params,
            })
        }
    }, [dispatch, nodeId, operation, setParams])
    
    function handleInputChange(value, paramIndex) {
        const id = Number(nodeId || 0)
        setParams((prev) =>
            prev.map((param, index) =>
                index === paramIndex ? value : param
            )
        );
        patchUserNodeByIndex(dispatch, id, { 
            params: myNodes[id].params?.map((p, index) => index === paramIndex ? value : p) || []
        })
    }

    function handleChangeMode(param, paramIndex) {        
        const id = Number(nodeId || 0)
        addUserNode(dispatch, { id: id + 1 })
        patchUserNodeByIndex(dispatch, id, { 
            params: myNodes[id].params?.map((p, index) => index === paramIndex ? myNodes.length : p) || [] // сетим myNodes.length, как id следующей ноды
        })
        setOperation()
        setParams([])
        navigate('/' + myNodes.length, { param }) // редиректим на страницу, param нужен для тайтла
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
                                <Button onClick={() => handleChangeMode(param, index)} type="text" size="small">
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
    nodeId: PropTypes.string,
    operation: PropTypes.instanceOf(Operation),
    setOperation: PropTypes.func.isRequired,
    params: PropTypes.arrayOf(PropTypes.string).isRequired,
    setParams: PropTypes.func,
};