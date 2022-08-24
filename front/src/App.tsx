import { MantineProvider } from '@mantine/core';
import {
  QueryClient,
  QueryClientProvider
} from 'react-query';
import './App.css';
import CreateGame from './page/game/CreateGame';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <CreateGame />
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
