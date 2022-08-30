import { Button, TextInput } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import axios from "axios";
import { useMutation } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
const shortUUID = require('short-uuid');

interface IGame {
    gameId: string; 
    playerId: string; 
    playerName: string 
}

const JoinGameForm = () => {
    const navigate = useNavigate();
    const { game } = useParams();
    const [ playerName, setPlayerName ] = useInputState('');

    const mutation = useMutation((gameJoin: IGame) => {
        return axios.post('join', gameJoin)
    },
    {
        onSuccess: (result) => {
            navigate(`/planning/${result.data.gameId}/${result.data.playerId}`);
        }
    });

    const gotoPlanning = () => {
        if (!playerName) {
            return;
        }

        function generateUID() {
            return shortUUID.generate();
        }

        const playerId = generateUID();

        mutation.mutate({ gameId: game ?? "", playerId, playerName });
    }

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
                <TextInput
                    error={!playerName} 
                    onChange={setPlayerName} 
                    placeholder="Type Your Name"/>
                <Button 
                    onClick={() => { gotoPlanning() }} disabled={mutation.isLoading}>Join Game!</Button>
            </div>
        </div>
    );
}

export default JoinGameForm;