import { IUserDtoWithGroups, userApi } from "@rest-adapter/ts-rest-contracts/user-contract";
import { initQueryClient, } from "@ts-rest/react-query";
import { TDataUploadContainer } from "../common/DataUploadContainer";
import { Box, Button, Grid, Theme, Typography } from "@mui/material";
import { useTheme } from "@mui/styles";
import { UpdateUserForm } from "./RestUpdateUserForm";

export const textView = {
  title: 'All Rest Users:',
  loading: 'Loading...',
  userNotFound: 'No user matches your criteria',
  refetch: 'Refetch'
}

export interface IHomePageProps {
}


export const queryClient = initQueryClient(userApi, {
  baseUrl: import.meta.env.VITE_USER_URL,
  baseHeaders: {},
});
interface IUserState extends TDataUploadContainer<'isPending', IUserDtoWithGroups[] | undefined, any> { };

const defaultState: IUserState = {
  isPending: true,
  data: [],
  error: undefined
}
export const getStyles = (theme: Theme) => ({
  container: {
    ...theme.box.absolutePosContainer,
    top: theme.areas.dataComponent['SubHeader']['height'],
    height: `calc(100% - ${theme.areas.dataComponent['SubHeader']['height']})`,
    ...theme.box.flexGrid,
    ...theme.box.bgColorAndBorder
  },
  testContainer: {
    position: 'absolute', width: '98%', height: `calc(100% - ${theme.areas.dataComponent['SubHeader']['height']})`, left: '2.5%',
    top: theme.areas.dataComponent['SubHeader']['height']
    , overflowY: 'auto'
    , boxSizing: 'border-box'
  },
  title: {
    marginLeft: 1,
    height: theme.areas.dataComponent['SubHeader']['height'],
    boxSizing: 'border-box'
  },
  outerContainer: {
    position: 'relative', height: '100%', width: '100%', boxSizing: 'border-box'
  },
  button: {
    ...theme.button, position: 'absolute', right: '10px', top: '0', height: '30px',
  },
  loadMsg: {
    ...theme.typography.loadMessages
  }
  ,
  errMsg: {
    ...theme.typography.errorMessages
  }

})


export function RestAllUsers(props: IHomePageProps) {
  const theme = useTheme() as Theme;
  const styles = getStyles(theme)

  const { data, error, isPending, refetch } = queryClient.getAll.useQuery(
    [],
    { query: { limit: 10 } }
  );

  return (

    <Box sx={{ ...styles.outerContainer }}>
      <Typography variant='h5' sx={{ ...styles.title }}>{textView.title}</Typography>
      <Button sx={{ ...styles.button }} onClick={() => refetch()}>{textView.refetch}</Button>
      <Grid container sx={{ ...styles.container }} spacing={0.5} className="restAllUsersGridContainer">
        {getRestJSX({ data: data?.body, error, isPending }, styles)}
      </Grid>
    </Box>

  );
}

const getRestJSX = (usersState: IUserState, styles: any): React.JSX.Element | React.JSX.Element[] => {
  if (usersState.error) {

    return <Typography sx={{ ...styles.errMsg }}>{usersState.error.message}</Typography>;

  }
  else if (usersState.isPending) {
    return <Typography sx={{ ...styles.loadMsg }}>{textView.loading}</Typography>;
  }
  else if (usersState.data === undefined) return <Typography sx={{ ...styles.loadMsg }}>{textView.userNotFound}</Typography>;
  else if (usersState.data && Array.isArray(usersState.data) && usersState.data.length === 0) {
    return <Typography sx={{ ...styles.loadMsg }}>{textView.userNotFound}</Typography>;
  }

  else {
    return (usersState.data?.map((user) => {
      return (
        <Grid item xs={6} key={user.userId} className="userFormParentGridItem"> <UpdateUserForm  {...user} /></Grid>
      )
    }))
  }
}
