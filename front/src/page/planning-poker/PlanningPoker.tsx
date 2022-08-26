import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "react-query";
import GameBoard from "./GameBoard";

const queryClient = new QueryClient();

const PlanningPoker = () => {
    return (
        <QueryClientProvider client={queryClient}>
          <MantineProvider withGlobalStyles withNormalizeCSS>
            <GameBoard />
          </MantineProvider>
        </QueryClientProvider>
      );
}

export default PlanningPoker;