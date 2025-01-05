import React from 'react';
import { Box, Grid, Theme } from '@mui/material';
import { MessagePage } from './ws/MessagePage';
import { RestPage } from './rest/RestPage';
import { GqlPage } from './graphql/GqlPage';
import { useTheme } from '@mui/styles';
import { getRestTheme } from './rest/RestTheme';
import { ThemeProvider } from '@mui/styles';
import { getGqlTheme } from './graphql/GqlTheme';
import { getWsTheme } from './ws/WsTheme';

export const getStyles = (theme: Theme) => ({
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    height: theme.areas.root['Msgs']['height'],
    boxSizing: 'border-box', justifyItems: 'center',
    margineTop: 0, margineBottom: 0
  },
  item: {
    border: 'solid 1px green', borderRadius: 2, width: '98%', boxSizing: 'border-box', height: '100%'
  },
  boxLeft: { gridColumnStart: 1, gridColumnEnd: 2 },
  boxCenter: { gridColumnStart: 2, gridColumnEnd: 3 },
  boxRight: { gridColumnStart: 3, gridColumnEnd: 3 }
})

export function HomePage() {
  const theme = useTheme() as Theme;
  const styles = getStyles(theme)
  return (
    <Box className='hPcontainer' sx={{ ...styles.container }}>

      <Box sx={{ ...styles.boxLeft, ...styles.item }}>
        <ThemeProvider theme={getRestTheme(theme)}>
          <RestPage />
        </ThemeProvider>
      </Box>
      <Box sx={{ ...styles.boxCenter, ...styles.item }}>
        <ThemeProvider theme={getGqlTheme(theme)}>
          <GqlPage />
        </ThemeProvider>
      </Box>

      <Box sx={{ ...styles.boxRight, ...styles.item }}>
        <ThemeProvider theme={getWsTheme(theme)}>
          <MessagePage />
        </ThemeProvider>
      </Box>

    </Box>
  );
}
