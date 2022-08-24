import { Button, Center } from "@mantine/core";
import React from "react";

const PointSelector = (props: IPointSelectorProps) => {
    const pointList = [1, 2, 3, 5, 8, 13, 21];

    return (
    <Center>
        <div>
            {
            pointList.map(point => 
                <Button
                    key={point} 
                    variant="default" 
                    style={ { margin: 10 } }
                    onClick={() => { props.onSelectPoint && props.onSelectPoint(point)} }>
                    {point}
                </Button>)
            }
        </div>
    </Center>
    );
}

interface IPointSelectorProps {
    onSelectPoint?: (pointSelected: number) => void
}

export default PointSelector;