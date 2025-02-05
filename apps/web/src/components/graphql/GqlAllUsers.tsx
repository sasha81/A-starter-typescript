import { Box, Button, Grid, Theme, Typography } from '@mui/material'
import { ApolloError, gql, useQuery } from '@apollo/client';
import { useTheme } from "@mui/styles";
import { GraphQLError } from 'graphql';
import { Group, UserViewDto } from '@graphql-adapter-code/dto/UserWithGroupDto';
import { UpdateUserForm } from './GqlUpdateUserForm';
import { DEFAULT_QUERY_LIMIT } from 'src/utils/consts';

export const textView = {
  title: 'All Gql Users:',
  loading: 'Loading...',
  userNotFound: 'No user matches your criteria',
  networkError: 'Network error',
  unknownError: 'UnknownError',
  refetch: 'Refetch'
}

export const GET_ALL_USERS = gql(`
    query FindUsers ($limit: Int!) {
        getAllUsers (limit: $limit) {
            name
            age
            userId
            groups{
              groupId
              groupName
              groupStatus
              userId
              userStatus
            }

        }
    }
`)


interface IGqlData {
  getAllUsers: UserViewDto[]
  errors?: GraphQLError[]
}
export interface IStrictGqlUser extends UserViewDto {
  age: number;
  name: string;
  userId: string;
  groups: Group[]
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
    ...theme.box.absolutePosContainer, height: `calc(100% - ${theme.areas.dataComponent['SubHeader']['height']})`,
    top: theme.areas.dataComponent['SubHeader']['height'],
    ...theme.box.bgColorAndBorder
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
    position: 'absolute', right: '10px', top: '0', height: '30px',
    ...theme.button,
  },
  loadMsg: { ...theme.typography.loadMessages }
  ,
  errMsg: { ...theme.typography.errorMessages }

})

export function GqlAllUsers() {
  const theme = useTheme() as Theme;
  const styles = getStyles(theme)
  const { data, loading, error, refetch } = useQuery<IGqlData>(GET_ALL_USERS, {variables :{limit: DEFAULT_QUERY_LIMIT}})




  return (
    <Box sx={{ ...styles.outerContainer }}>
      <Typography variant='h5' sx={{ ...styles.title }}>{textView.title}</Typography>
      <Button sx={{ ...styles.button }} onClick={() => refetch()}>{textView.refetch}</Button>
      <Grid container sx={{ ...styles.container }} spacing={0.5}>
        {getGqlJSX(data, loading, error, styles)}
      </Grid>
    </Box>
  )

}

const getGqlJSX = (data: IGqlData | undefined, loading: boolean, error: ApolloError | undefined, styles: any): React.JSX.Element | React.JSX.Element[] => {

  if (loading) {
    return <Typography sx={{ ...styles.loadMsg }}>{textView.loading}</Typography>;
  }
  else if (error || data?.errors) {
    return <Typography sx={{ ...styles.errMsg }}>{getErrorMessage(error, data, textView.unknownError)}</Typography>
  }
  else if (data && Array.isArray(data.getAllUsers) && data.getAllUsers.length === 0) {
    return <Typography sx={{ ...styles.loadMsg }}>{textView.userNotFound}</Typography>;
  }

  else {
    const filteredUsers = data?.getAllUsers.filter(user => { return user.name && user.age && user.userId }) as IStrictGqlUser[];
    return filteredUsers.map((user) => {

      return (
        <Grid item xs={6} key={user.userId} ><UpdateUserForm  {...user} /></Grid>
      )
    })
  }


}



export const getErrorMessage = (error: ApolloError | undefined, data: any, unknownError: string): string | React.JSX.Element[] => {

  if (error) return error.message;
  if (data && data.errors && Array.isArray(data.errors)) return data.errors.map((err: GraphQLError) => { return err.message }).join('\n');
  return unknownError
}