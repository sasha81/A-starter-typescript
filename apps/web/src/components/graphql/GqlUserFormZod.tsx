import { useEffect, useState } from 'react';
import { Button, TextField, Theme, Typography, } from '@mui/material'
import { useTheme } from '@mui/styles'
import { CreateUserInput } from '@graphql-adapter-code/dto/CreateUserInput'
import { createUserDtoSchema } from '@graphql-adapter-code/zod-schema/user-zod.schema'
import { ApolloError, gql, useMutation } from '@apollo/client';
import { GraphQLError } from 'graphql';
import { useForm } from 'react-hook-form-mui';
import { zodResolver } from '@hookform/resolvers/zod';
import { TwoRowBoxWithProps } from '../common/CustomBoxes';
import { CollapsableErrorWithPros, CollapsableSuccessWithPros } from '../common/CustomCollapsables';



export const textView = {
  processing: 'Processing...',
  enterNewUser: 'Enter a new User',
  namePlaceholder: 'User name',
  agePlaceholder: 'User age',
  mutationSuccess: 'Operation succeeded!',
  unknownError: 'Unknown Error!',
  submit: 'Submit'
}
export const CREATE_USER = gql(`
    mutation CreateUser($input: CreateUserInput!){
        createUser(input: $input) {           
            userId
            name
            age
        }
    }
`);

const initiState: CreateUserInput = {
  name: '',
  age: 18
}
export const getStyles = (theme: Theme) => ({
  title: {
    ...theme.areas.nameAgeCreateForm['Title']['sx']
  },
  button: {
    ...theme.areas.nameAgeCreateForm['Button']['sx']
  },
  name: { ...theme.areas.nameAgeCreateForm['Name']['sx'] },
  age: { ...theme.areas.nameAgeCreateForm['Age']['sx'] },
  loadMsg: {
    ...theme.typography.loadMessages
  },
  collapsSuccMsg: {
    ...theme.typography.loadMessages, ...theme.box.collapsableText
  }
  ,
  errMsg: {
    ...theme.typography.errorMessages
  },
  collapsErrMsg: {
    ...theme.typography.errorMessages, ...theme.box.collapsableText
  }
})


export function GqlUserFormZod() {
  const theme = useTheme() as Theme;
  const styles = getStyles(theme)
  const [saveUser, { error, data, loading }] = useMutation(CREATE_USER)

  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

  const {
    // register: function to register input elements
    register,
    // handleSubmit: function to handle form submission
    handleSubmit,
    // watch: function to watch values of form inputs
    watch,
    // formState: object containing information about form state
    formState: { errors, touchedFields }, // Destructure errors and touchedFields from formState
  } = useForm<CreateUserInput>({ // Call useForm hook with generic type FormData
    // resolver: specify resolver for form validation using Zod
    resolver: zodResolver(createUserDtoSchema), // Pass Zod schema to resolver
    // defaultValues: specify default values for form inputs
    defaultValues: initiState,
  });

  useEffect(() => {

    const areThereErrors = error || (data && data.hasOwnProperty('errors'))
    areThereErrors ? setOpenError(true) : setOpenError(false)

  }, [error, data])


  useEffect(() => {

    const noErrors = data && !data.hasOwnProperty('errors')
    noErrors ? setOpenSuccess(true) : setOpenSuccess(false)

  }, [data])



  const handleSubmitForm = (inputs: CreateUserInput) => {
    saveUser({ variables: { input: prepareInput(inputs) } }).catch(e => { })
  }

  const prepareInput = (input: { name: string, age: number | string }): CreateUserInput => {
    return { name: input.name, age: Number(input.age) }
  }

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)} >
      <CollapsableErrorWithPros sx={{ position: 'absolute', mt: 2.5 }} in={openError} onActionClick={() => { setOpenError(false) }}>
        <Typography sx={{ ...styles.collapsErrMsg }}> {getErrorMessage(error, data, textView.unknownError)}</Typography>
      </CollapsableErrorWithPros>

      <CollapsableSuccessWithPros sx={{ position: 'absolute' }} in={openSuccess} onActionClick={() => { setOpenSuccess(false) }}>
        <Typography sx={{ ...styles.collapsSuccMsg }}> {getSuccessMessage(textView.mutationSuccess, data)}</Typography>
      </CollapsableSuccessWithPros>


      <TwoRowBoxWithProps height={theme.areas.dataComponent['Form']['height']}>
        {/* <GridTitleTypography>{loading ? textView.processing : textView.enterNewUser}</GridTitleTypography> */}
        <Typography sx={{ ...styles.title }}>{loading ? textView.processing : textView.enterNewUser}</Typography>
        <TextField
          defaultValue={initiState.name}
          {...register("name")}
          size="small"
          error={!!errors.name}
          helperText={errors.name?.message}
          type={'text'}
          sx={{ ...styles.name }}
          placeholder={textView.namePlaceholder}
          variant='outlined'
        />


        <TextField
          defaultValue={initiState.age}
          type={'number'}
          {...register("age", { valueAsNumber: true })}
          error={!!errors.age}
          size="small"
          helperText={errors.age?.message}
          sx={{ ...styles.age }}
          placeholder={textView.agePlaceholder}
          variant='outlined'
        />

        <Button sx={{ ...styles.button }} type='submit'>{textView.submit}</Button>
      </TwoRowBoxWithProps>
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
