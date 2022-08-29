import { MantineProvider } from '@mantine/core';
import {
    QueryClient,
    QueryClientProvider
} from 'react-query';
import ReconnectForm from './ReconnectForm';

const queryClient = new QueryClient();

function Reconnect() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <ReconnectForm />
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default Reconnect;
