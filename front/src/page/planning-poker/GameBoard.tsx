import { Button, Text } from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { IGame } from "../interfaces/IGame";
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

  const { data: gameState, refetch: refetchGameState, isFetching: isFetchingGameState } = useQuery(
    "game-state",
    () => {
      return axios.get(`game-state/${game}`);
    },
    { onError: () => { navigate("/") }, refetchInterval: 2000 }
  );

  const getJoinURL = () => {
    return new URL(`/join/${game}/new`, process.env.REACT_APP_CLIENT_URL).href
  }

  useEffect(() => {
    if (!isFetchingGameState) {
      const playerFound = gameState?.data.players.find((p: IPlayer) => p.id === player);
      if (!playerFound) {
        const redirectURL = `/join/${game}/reconnect`;
        navigate(redirectURL, { replace: true });
      } else {
        sessionStorage.setItem("playerId", player ?? "");
        sessionStorage.setItem("gameId", game ?? "");
        sessionStorage.setItem("playerName", playerFound.name);
      }
    }
  }, [gameState?.data.players, isFetchingGameState]);

  useEffect(() => {
    if (!game || !player ||
      (!isFetchingGameState && !gameState?.data)) {
      navigate("/");
    }
  }, [game, player, navigate, isFetchingGameState, gameState?.data]);

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
    let votes = 0;

    const points: Array<number> = playersData.map((p) => {
      if (p.point) {
        votes++;
      }
      return p.point;
    });
    const sum = points.reduce(
      (prev: number, current: number) => (current += prev)
    );
    
    return ((sum ?? 0) / votes).toFixed(2);
  };

  const getAllCardsValues = () => {
    if (!showCardValue) {
      return {};
    }

    const cards: { [key: string]: number } = {};
    const playersData = gameState?.data.players as Array<IPlayer>;
    playersData.forEach((pd) => {
      if (pd.point) {
        if (!cards[pd.point]) {
          cards[pd.point] = 1;
        } else {
          cards[pd.point] += 1;
        }
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
        height: "100vh",
        backgroundColor: "#c7dcff"
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
                showValue={p.id === player || showCardValue}
                value={p.point ?? 0}
              />
            );
          })}
        </div>
        <Button style={{ marginTop: "20px" }} onClick={() => revealCards()}>
          Revelar Cartas
        </Button>
        <PointSelector onSelectPoint={(point) => postPoint(point)} />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Text>Média: {getAvgCardsValues()}</Text>
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
            Limpar
          </Button>
          <Button style={{ marginTop: "50px" }} onClick={() => {
            if (player) {
              sessionStorage.removeItem("playerId");
              sessionStorage.removeItem("gameId");
              sessionStorage.removeItem("playerName");
              leaveGameMutation.mutate(player);
            }
            navigate("/");
          }}>
            Sair
          </Button>
        </div>
        <div 
          style={{ 
            display: "flex", 
            flexDirection: "row", 
            marginTop: "200px", 
            justifyContent: "space-between", 
            alignItems: "center", 
            backgroundColor: "#ffffff", 
            padding: "10px",
            borderRadius: "8px"
          }}>
          <Text>
            {getJoinURL()}
          </Text>
          <Button style={{ marginLeft: "10px" }} variant="outline" onClick={() => { navigator.clipboard.writeText(getJoinURL()) }} >Copiar</Button>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
