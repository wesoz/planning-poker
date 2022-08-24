import { Button, Center, Text } from "@mantine/core";
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
};

interface IPostPoint {
    gameId: string; 
    playerId: string; 
    pointValue: number;
};

const CardsArea = () => {
    const navigate = useNavigate();
    const { game, player } = useParams();
    const [showCardValue, setShowCardValue] = useState(false);

    useEffect(() => {
        if (!game) {
            navigate("/");
        }
    }, [game]);

    const { data: players, refetch: refetchPlayers } = useQuery("players", () => {
        return axios.get("players");
    }, { onError: () => navigate("/"), refetchInterval: 2000 });

    const postPointMutation = useMutation((postPoint: IPostPoint) => {
        return axios.post('point', postPoint)
    }, { onSuccess: () => { refetchPlayers(); } });

    const clearPointsMutation = useMutation(() => {
        return axios.post('clear')
    }, { onSuccess: () => { refetchPlayers(); } });

    const postPoint = (point: number) => {
        postPointMutation.mutate({ gameId: game ?? "", playerId: player ?? "", pointValue: point })
    };

    const clearPoints = () => {
        setShowCardValue(false);
        clearPointsMutation.mutate();
    };

    const revealCards = () => {
        setShowCardValue(true);
    };

    const getAvgCardsValues = () => {
        if (!showCardValue) {
            return 0;
        }
        const playersData = players?.data as Array<IPlayer>;
        const points = playersData.map(p => p.point);
        const sum = points.reduce((prev: number, current: number) => 
            current += prev
        );

        return sum ?? 0;
    }

    const getAllCardsValues = () => {
        if (!showCardValue) {
            return {};
        }

        const cards: {[key: string]: number} = {};
        const playersData = players?.data as Array<IPlayer>;
        playersData.forEach(pd => {
            if (!cards[pd.point]) {
                cards[pd.point] = 1;
            } else {
                cards[pd.point] += 1;
            }
        });

        return cards;
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
                display: "flex" ,
                flexDirection: "column"
            }}>
                <div 
                    style={{ 
                        display: "flex" ,
                        justifyContent: "space-around"
                    }}
                >
                    {players?.data.map((p: IPlayer) => {
                        return ( 
                            <Card
                            key={p.id}
                            name={p.name}
                            showValue={showCardValue} 
                            value={p.point ?? 0} />
                        );
                    })}
                </div>
                <Button style={{ marginTop: "20px" }}
                    onClick={() => revealCards()}>Reveal Cards</Button>
                <PointSelector onSelectPoint={(point) => postPoint(point)} />
                <div style={{ display: "flex", justifyContent: "center" }}><Text>Average: {getAvgCardsValues()}</Text></div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>{Object.keys(getAllCardsValues()).map(key => { return <Text key={key}>{key} = {getAllCardsValues()[key]}</Text> })}</div>
                <div style={{ 
                    display: "flex", 
                    justifyContent: "space-around",
                    alignItems: "center"
                }}>
                    <Button style={{ marginTop: "50px" }}
                        onClick={() => clearPoints()}>Clear</Button>
                    <Button style={{ marginTop: "50px" }}
                        onClick={() => navigate("/")}>Quit</Button>
                </div>
                <Text style={{ marginTop: "50px" }}>http://localhost:3000/join/{game}</Text>
            </div>
        </div>
    );
}

export default CardsArea;