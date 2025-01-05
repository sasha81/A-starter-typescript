import { useEffect, useState } from 'react';
import { Alert, Box, Button, Collapse, IconButton, TextField, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import { CreateUserInput } from '@graphql-adapter-code/dto/CreateUserInput'
import { ApolloError, gql, useMutation } from '@apollo/client';
import { GraphQLError } from 'graphql';



export const textView = {
  processing: 'Processing...',
  enterNewUser: 'Enter a new User',
  namePlaceholder: 'User name',
  agePlaceholder: 'User age',
  mutationSuccess: 'Operation succeeded!',
  unknownError: 'Unknown Error!'
}
export const CREATE_USER = gql(`
    mutation CreateUser($input: CreateUserInput!){
        createUser(input: $input) {           
            id
        }
    }
`);

const initiState: CreateUserInput = {
  name: '',
  age: 18
}

export function GqlUserForm() {
  const [inputs, setInputs] = useState<CreateUserInput>(initiState)

  const [saveUser, { error, data, loading }] = useMutation(CREATE_USER)

  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

  useEffect(() => {

    const areThereErrors = error || (data && data.hasOwnProperty('errors'))
    areThereErrors ? setOpenError(true) : setOpenError(false)

  }, [error, data])


  useEffect(() => {

    const noErrors = data && !data.hasOwnProperty('errors')
    noErrors ? setOpenSuccess(true) : setOpenSuccess(false)

  }, [data])


  const handleChange = (e: any) => {
    setInputs((prevState: CreateUserInput) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()

    saveUser({ variables: { input: prepareInput(inputs) } }).catch(e => { })


  }

  const prepareInput = (input: { name: string, age: number | string }): CreateUserInput => {
    return { name: input.name, age: Number(input.age) }
  }
  //console.log('data.errors.length: ', data&& data.errors&& data.errors)
  return (
    <form onSubmit={handleSubmit} >
      <Collapse sx={{ 'position': 'absolute' }} in={openError}>
        <Alert severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpenError(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {getErrorMessage(error, data, textView.unknownError)}
        </Alert>
      </Collapse>
      <Collapse sx={{ 'position': 'absolute' }} in={openSuccess}>
        <Alert severity="success"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpenSuccess(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {getSuccessMessage(textView.mutationSuccess, data)}
        </Alert>
      </Collapse>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gridTemplateRows: '1fr 2fr', boxSizing: 'border-box', height: '130px', alignItems: 'center' }}>
        <Typography sx={{ gridRow: 1, gridColumnStart: 1, gridColumnEnd: 8, margin: 1 }}>{loading ? textView.processing : textView.enterNewUser}</Typography>
        <TextField
          name='name'
          value={inputs.name}
          onChange={handleChange}
          type={'text'}
          sx={{ margin: 0.5, gridRow: 2, gridColumnStart: 1, gridColumnEnd: 6 }}
          placeholder='User name'
          variant='outlined'
        />


        <TextField
          name='age'
          value={inputs.age}
          type={'number'}
          onChange={handleChange}
          sx={{ margin: 0.5, gridRow: 2, gridColumnStart: 6, gridColumnEnd: 8 }}
          placeholder='User age'
          variant='outlined'
        />

        <Button sx={{ gridRow: 2, gridColumnStart: 8, gridColumnEnd: 8 }} type='submit'>Submit</Button>
      </Box>
    </form>

  )

}

export const getSuccessMessage = (baseMsg: string, data: { createUser: { id: string } } | null | undefined): string => {
  if (data && data.createUser && data.createUser.id) {
    return baseMsg + " " + data.createUser.id;
  }
  else {
    return baseMsg;
  }
}

export const getErrorMessage = (error: ApolloError | undefined, data: any, unknownError: string): string | React.JSX.Element[] => {

  if (error) return error.message;
  if (data && data.errors && Array.isArray(data.errors)) return data.errors.map((err: GraphQLError) => { return err.message }).join('\n');
  // if(data && data.errors && Array.isArray(data.errors)) return data.errors.map((err:GraphQLError)=>{
  //   return ( <Typography>{err.message}</Typography>)
  // })
  return unknownError
}

