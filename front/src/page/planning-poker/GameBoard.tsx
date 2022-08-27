import { Button, Text } from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import Card from "./components/Card";
import PointSelector from "./components/PointSelector";

interface IPlayer {
  id: string;
  name: string;
  point: number;
}

interface IPostPoint {
  gameId: string;
  playerId: string;
  pointValue: number;
}

const GameBoard = () => {
  const navigate = useNavigate();
  const { game, player } = useParams();
  const [showCardValue, setShowCardValue] = useState(false);

  useEffect(() => {
    if (!game || !player) {
      navigate("/");
    }
  }, [game, player, navigate]);

  const leaveGameMutation = useMutation(
    (playerId: string) => {
      return axios.post("leave", { gameId: game, playerId });
    }
  );

  useEffect(() => {
    const leaveGame = () => { if (player) { leaveGameMutation.mutate(player); } };

    window.addEventListener("beforeunload", leaveGame);

    return () => window.removeEventListener("beforeunload", leaveGame);
  }, []);

  const { data: gameState, refetch: refetchGameState } = useQuery(
    "game-state",
    () => {
      return axios.get(`game-state/${game}`);
    },
    { onError: () => navigate("/"), refetchInterval: 2000 }
  );

  useEffect(() => {
    setShowCardValue(gameState?.data.showCards)
  }, [gameState?.data.showCards]);

  const postPointMutation = useMutation(
    (postPoint: IPostPoint) => {
      return axios.post("point", postPoint);
    },
    {
      onSuccess: () => {
        refetchGameState();
      },
    }
  );

  const clearPointsMutation = useMutation(
    () => {
      return axios.post("clear", { gameId: game });
    },
    {
      onSuccess: () => {
        refetchGameState();
      },
    }
  );

  const postPoint = (point: number) => {
    postPointMutation.mutate({
      gameId: game ?? "",
      playerId: player ?? "",
      pointValue: point,
    });
  };

  const clearPoints = () => {
    setShowCardValue(false);
    clearPointsMutation.mutate();
  };


  const showCardsMutation = useMutation(
    () => {
      return axios.post("show", { gameId: game });
    },
    {
      onSuccess: () => {
        refetchGameState();
      },
    }
  );


  const revealCards = () => {
    showCardsMutation.mutate();
    setShowCardValue(true);
  };

  const getAvgCardsValues = () => {
    if (!showCardValue) {
      return 0;
    }
    const playersData = gameState?.data.players as Array<IPlayer>;
    const points = playersData.map((p) => p.point);
    const sum = points.reduce(
      (prev: number, current: number) => (current += prev)
    );

    return sum ?? 0;
  };

  const getAllCardsValues = () => {
    if (!showCardValue) {
      return {};
    }

    const cards: { [key: string]: number } = {};
    const playersData = gameState?.data.players as Array<IPlayer>;
    playersData.forEach((pd) => {
      if (!cards[pd.point]) {
        cards[pd.point] = 1;
      } else {
        cards[pd.point] += 1;
      }
    });

    return cards;
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "25px",
        height: "500px",
        outline: "dashed 1px black",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          {gameState?.data?.players?.map((p: IPlayer) => {
            return (
              <Card
                key={p.id}
                name={p.name}
                showValue={showCardValue}
                value={p.point ?? 0}
              />
            );
          })}
        </div>
        <Button style={{ marginTop: "20px" }} onClick={() => revealCards()}>
          Reveal Cards
        </Button>
        <PointSelector onSelectPoint={(point) => postPoint(point)} />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Text>Average: {getAvgCardsValues()}</Text>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {Object.keys(getAllCardsValues()).map((key) => {
            return (
              <Text key={key}>
                {key} = {getAllCardsValues()[key]}
              </Text>
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Button style={{ marginTop: "50px" }} onClick={() => clearPoints()}>
            Clear
          </Button>
          <Button style={{ marginTop: "50px" }} onClick={() => navigate("/")}>
            Quit
          </Button>
        </div>
        <Text style={{ marginTop: "50px" }}>
          http://localhost:3000/join/{game}
        </Text>
      </div>
    </div>
  );
};

export default GameBoard;
