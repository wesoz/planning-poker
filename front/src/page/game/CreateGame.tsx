import { Button, Input, TextInput } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import axios from "axios";
import React from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
const shortUUID = require('short-uuid');

interface IGame {
    gameId: string; 
    playerId: string; 
    playerName: string 
}

const CreateGame = () => {
    const navigate = useNavigate();
    const [ playerName, setPlayerName ] = useInputState('');

    const mutation = useMutation((newGame: IGame) => {
        return axios.post('create', newGame)
    });

    const gotoPlanning = () => {
        if (!playerName) {
            return;
        }

        function generateUID() {
            return shortUUID.generate();
        }

        const gameId = generateUID();
        const playerId = generateUID();

        mutation.mutate({ gameId, playerId, playerName });
        navigate(`planning/${gameId}/${playerId}`);
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
                    onClick={() => { gotoPlanning() }}>Create Game!</Button>
            </div>
        </div>
    );
}

export default CreateGame;