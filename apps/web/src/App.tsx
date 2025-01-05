import { StrictMode } from 'react'
import { HomePage } from './components/HomePage'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { Container, Paper, Theme, Typography } from '@mui/material';
import { useTheme } from '@mui/styles';

const queryClient = new QueryClient();

const graphqlClient = new ApolloClient({
  uri: `${import.meta.env.VITE_GRAPHQL_ADAPTER}/graphql`,
  cache: new InMemoryCache()
});
const useStyles = (theme: Theme) => ({
  mainTitle: {
    height: theme.areas.root['mainHeader']['height'], ...theme.typography.mainTitle
  }
});

export const App = () => {
  const theme = useTheme() as Theme
  const classes = useStyles(theme);

  return (
    <ApolloProvider client={graphqlClient}>
      <QueryClientProvider client={queryClient}>
        <StrictMode>

          <Container maxWidth={'xl'} sx={{ overflowY: 'hidden', height: '100vh' }}>
            <Paper elevation={4} >
              <Typography sx={{ ...classes.mainTitle }} variant='h3'>Fullstack ReactJS NestJS monorepo system</Typography>
              <HomePage />
            </Paper>
          </Container>

        </StrictMode>
      </QueryClientProvider>
    </ApolloProvider>
  )
}