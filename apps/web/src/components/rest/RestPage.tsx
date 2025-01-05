import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Box, Theme, Typography } from '@mui/material';
import { UserFormZod as UserForm } from './UserFormZod';
import { RestAllUsers } from './RestAllUsers';
import { useTheme } from '@mui/styles';

export const textView = {
  title: 'Ts-rest Protocol'
}
export const getStyles = (theme: Theme) => ({
  title: { textAlign: 'center', height: theme.areas.dataComponent['Header']['height'] },
  allUsers: {
    height: `calc(100% - ${theme.areas.dataComponent['Form']['height']} - ${theme.areas.dataComponent['Header']['height']})`,
    width: '100%'
  }
})
const queryClient = new QueryClient();

export const RestPage = (): React.JSX.Element => {
  const theme = useTheme() as Theme;
  const classes = getStyles(theme)
  return (
    <QueryClientProvider client={queryClient}>
      <Typography sx={{ ...classes.title }} variant="h4">{textView.title}</Typography>
      <UserForm />

      <Box className='restAllUsers' sx={{ ...classes.allUsers }}>
        <RestAllUsers />
      </Box>

    </QueryClientProvider>
  )
}