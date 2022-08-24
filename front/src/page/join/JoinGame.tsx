import { MantineProvider } from '@mantine/core';
import {
    QueryClient,
    QueryClientProvider
} from 'react-query';
import JoinGameForm from './JoinGameForm';

const queryClient = new QueryClient();

function JoinGame() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <JoinGameForm />
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default JoinGame;
