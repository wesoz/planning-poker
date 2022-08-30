import { Button, Loader, TextInput, Title } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import axios from "axios";
import { useMutation } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { IGame } from "../interfaces/IGame";
const shortUUID = require('short-uuid');



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
        <div 
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                backgroundColor: "#c7dcff"
            }}>
            <div 
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "50px",
                    backgroundColor: "#ffffff",
                    borderRadius: "25px",
                }}>
                <Title style={{ marginBottom: "80px" }}>Join Game</Title>
                <TextInput
                    style={{ margin: "10px" }}
                    error={!playerName} 
                    onChange={setPlayerName} 
                    placeholder="Type Your Name"
                    disabled={mutation.isLoading}/>
                <Button 
                    style={{ margin: "50px" }}
                    onClick={() => { gotoPlanning() }} 
                    disabled={mutation.isLoading}
                >
                    Join Game!
                </Button>
                {mutation.isLoading && <Loader />}
            </div>
        </div>
    );
}

export default JoinGameForm;