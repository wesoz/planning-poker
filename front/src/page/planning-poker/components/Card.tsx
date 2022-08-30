import { Box, Center, MantineTheme, Text } from "@mantine/core";
import React from "react";

const Card = (props: ICardsProps) => {

    const getValue = () => {
        if (!props.showValue) {
            return "--";
        }
        return props.value === 0 ? "--" : props.value;
    }

    return (
    <Center>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Text style={{ fontWeight: "bold" }}>{props.name}</Text>
            <Box 
                sx={(theme) => ({
                backgroundColor: props.showValue || props.value === 0 ? theme.colors.gray[0] : theme.colors.dark[2],
                color: props.showValue || props.value === 0 ?  theme.colors.dark[8] : theme.colors.dark[2],
                textAlign: 'center',
                padding: theme.spacing.lg,
                borderRadius: theme.radius.md,
                cursor: 'pointer',
        
                '&:hover': {
                    backgroundColor: props.showValue  || props.value === 0 ? theme.colors.gray[1] : theme.colors.dark[3],
                    color: props.showValue  || props.value === 0 ? theme.colors.gray[1] : theme.colors.dark[3],
                },
                minWidth: 58,
                minHeight: 30
                })}
            >
                {getValue()}
            </Box>
        </div>
    </Center>
    );
}

interface ICardsProps {
    name: string;
    value: number;
    showValue: boolean;
}

export default Card;