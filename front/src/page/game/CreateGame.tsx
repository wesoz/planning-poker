import { Button, Loader, TextInput, Title } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import axios from "axios";
import React from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
const shortUUID = require("short-uuid");

interface IGame {
  gameId: string;
  playerId: string;
  playerName: string;
}

const CreateGame = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useInputState("");

  const mutation = useMutation((newGame: IGame) => axios.post("create", newGame), 
  { onSuccess: (result) => navigate(`planning/${result.data.gameId}/${result.data.playerId}`) });

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
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#c7dcff"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "50px",
          backgroundColor: "#ffffff",
          borderRadius: "25px",
        }}
      >
        <Title style={{ marginBottom: "80px" }}>Create New Game</Title>
        <TextInput
          style={{ margin: "10px" }}
          error={!playerName}
          onChange={setPlayerName}
          placeholder="Type Your Name"
          maxLength={20}
          disabled={mutation.isLoading}
        />
        <Button
          style={{ margin: "50px" }}
          onClick={() => {
            gotoPlanning();
          }}
          disabled={mutation.isLoading}
        >
          Create Game!
        </Button>
        {mutation.isLoading && <Loader />}
      </div>
    </div>
  );
};

export default CreateGame;
