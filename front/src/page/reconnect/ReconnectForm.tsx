import { Text } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import axios from "axios";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";


const ReconnectForm = () => {
    const navigate = useNavigate();
    const { game, player } = useParams();
    const [ resultMessage, setResultMessage ] = useInputState('Validating...');

    const { data, isFetching } = useQuery(["validate-player", game, player],() => {
        return axios.get(`validate-player/${game}/${player}`);
    });

    useEffect(() => {
        if (!isFetching && data?.data === true) {
            navigate(`/planning/${game}/${player}`);
        } else {
            setResultMessage("Player or game is invalid.");
        }
    }, [data, isFetching]);

    return (
        <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center",
            margin: "25px",
            height: "500px",
            outline: "dashed 1px black",
         }}>
            <div style={{ 
                display: "flex", 
                flexDirection:"column",
                justifyContent: "space-around", 
                height: "200px" 
            }}>
                <Text>{resultMessage}</Text>
            </div>
        </div>
    );
}

export default ReconnectForm;