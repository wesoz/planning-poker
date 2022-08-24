import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "react-query";
import CardsArea from "./CardsArea";

const queryClient = new QueryClient();

const PlanningPoker = () => {
    return (
        <QueryClientProvider client={queryClient}>
          <MantineProvider withGlobalStyles withNormalizeCSS>
            <CardsArea />
          </MantineProvider>
        </QueryClientProvider>
      );
}

export default PlanningPoker;