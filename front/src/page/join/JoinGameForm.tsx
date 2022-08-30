import { Button, Loader, TextInput, Title } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import axios from "axios";
import { useMutation } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { IGame } from "../interfaces/IGame";
const shortUUID = require('short-uuid');



const JoinGameForm = () => {
    const navigate = useNavigate();
    const { game, player } = useParams();
    const [ playerName, setPlayerName ] = useInputState('');

    const joinGameMutation = useMutation((gameJoin: IGame) => {
        return axios.post('join', gameJoin)
    },
    {
        onSuccess: (result) => navigate(`/planning/${result.data.gameId}/${result.data.playerId}`, { replace: true })
    });

    const gotoPlanning = () => {
        if (!playerName) {
            return;
        }

        function generateUID() {
            return shortUUID.generate();
        }

        const playerId = generateUID();

        joinGameMutation.mutate({ gameId: game ?? "", playerId, playerName });
    }

    const render = () => {
        if (player !== 'new') {
            const gameId = sessionStorage.getItem("gameId");
            const playerId = sessionStorage.getItem("playerId");
            const playerName = sessionStorage.getItem("playerName");
            if (gameId && playerId && playerName) {
                joinGameMutation.mutate({ gameId, playerId, playerName });
            } else {
                navigate("/");
            }
            return (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Title order={3} style={{ marginBottom: "30px" }}>Reconnecting...</Title>
                    <Loader />
                </div>
            );
        } else {
            return (
                <div>
                    <Title style={{ marginBottom: "80px" }}>Join Game</Title>
                    <TextInput
                        style={{ margin: "10px" }}
                        error={!playerName} 
                        onChange={setPlayerName} 
                        placeholder="Type Your Name"
                        disabled={joinGameMutation.isLoading}/>
                    <Button 
                        style={{ margin: "50px" }}
                        onClick={() => { gotoPlanning() }} 
                        disabled={joinGameMutation.isLoading}
                    >
                        Join Game!
                    </Button>
                    {joinGameMutation.isLoading && <Loader />}
                </div>
            );
        }
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
                {render()}
            </div>
        </div>
    );
}

export default JoinGameForm;