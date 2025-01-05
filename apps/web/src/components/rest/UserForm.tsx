import { ICreateUserDto} from '@rest-adapter/ts-rest-contracts/user-contract';
import { useEffect, useState } from 'react';
import { queryClient } from './RestAllUsers';
import { Alert, Box, Button, Collapse, IconButton, TextField, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';

export const textView = {
  processing: 'Processing...',
  enterNewUser: 'Enter a new User',
  namePlaceholder: 'User name',
  agePlaceholder: 'Age',
  mutationSuccess: 'Operation succeeded!',
  unknownError: 'Unknown error!',
  submitButton: 'Submit'
}


const initFormState: ICreateUserDto = {
  name: '',
  age: 18
}

export function UserForm() {
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [inputs, setInputs] = useState<ICreateUserDto>(initFormState)
  const { mutate, isPending, error, data } = queryClient.create.useMutation();


  useEffect(() => {
    let timer1: any;
    error?.status ? setOpenError(true) : setOpenError(false)
    if (error?.status) { timer1 = setTimeout(() => setOpenError(false), 2000); }
    return () => clearTimeout(timer1);
  }, [error])


  useEffect(() => {
    let timer1: any;
    data?.body ? setOpenSuccess(true) : setOpenSuccess(false)
    if (data?.body) { timer1 = setTimeout(() => setOpenSuccess(false), 2000); }
    return () => clearTimeout(timer1);
  }, [data])

  const handleChange = (e: any) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    mutate({ body: prepareInput(inputs) })
    setInputs(initFormState)
  }

  const prepareInput = (input: { name: string, age: number | string }): ICreateUserDto => {
    return { name: input.name, age: Number(input.age) }
  }

  return (
    <form onSubmit={handleSubmit}>
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
          {getErrorMessage(error, textView.unknownError)}
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
          {textView.mutationSuccess}
        </Alert>
      </Collapse>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gridTemplateRows: '1fr 2fr' }}>
        <Typography sx={{ gridRow: 1, gridColumnStart: 1, gridColumnEnd: 8 }}>{isPending ? textView.processing : textView.enterNewUser}</Typography>
        <TextField
          name='name'
          value={inputs.name}
          onChange={handleChange}
          type={'text'}
          sx={{ margin: 0.5, gridRow: 2, gridColumnStart: 1, gridColumnEnd: 6 }}
          placeholder={textView.namePlaceholder}
          variant='outlined'
        />


        <TextField
          name='age'
          value={inputs.age}
          type={'number'}
          onChange={handleChange}
          sx={{ margin: 0.5, gridRow: 2, gridColumnStart: 6, gridColumnEnd: 8 }}
          placeholder={textView.agePlaceholder}
          variant='outlined'
        />

        <Button sx={{ gridRow: 2, gridColumnStart: 8, gridColumnEnd: 8 }} type='submit'>{textView.submitButton}</Button>
      </Box>
    </form>
  )

}

const getErrorMessage = (error: any, unknownError: string): string => {
  if (error?.message) return error.message;
  else if (error?.body) return error.body as string;
  else return unknownError
}