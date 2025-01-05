import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { Box, Theme, Typography } from "@mui/material";
import { GqlUserFormZod as GqlUserForm } from "./GqlUserFormZod";
import { GqlAllUsers } from "./GqlAllUsers";
import { useTheme } from '@mui/styles';

export const textView = {
  title: 'Graphql Protocol',

}

const graphqlClient = new ApolloClient({
  uri: `${import.meta.env.VITE_GRAPHQL_ADAPTER}/graphql`,
  cache: new InMemoryCache()
});
export const getStyles = (theme: Theme) => ({
  title: {
    textAlign: 'center', height: theme.areas.dataComponent['Header']['height']
  },
  allUsers: {
    height: `calc(100% - ${theme.areas.dataComponent['Form']['height']} - ${theme.areas.dataComponent['Header']['height']})`,
     width: '100%'
  }
})
export const GqlPage = (): React.JSX.Element => {
  const theme = useTheme() as Theme;
  const classes = getStyles(theme)

  return (
    <ApolloProvider client={graphqlClient}>
      <Typography sx={{ ...classes.title }} variant="h4">{textView.title}</Typography>
      <GqlUserForm />
      <Box sx={{ ...classes.allUsers }}>
        <GqlAllUsers />
      </Box>

    </ApolloProvider>
  )
}