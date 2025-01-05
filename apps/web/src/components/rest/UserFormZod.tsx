import { ICreateUserDto, TCreateUserDto, createUserDtoSchema } from '@rest-adapter/ts-rest-contracts/user-contract';
import { useEffect, useState } from 'react';
import { queryClient } from './RestAllUsers';
import { Button, TextField, Theme, Typography } from '@mui/material'
import { useForm } from 'react-hook-form-mui'
import { zodResolver } from "@hookform/resolvers/zod";
import { TwoRowBoxWithProps } from '../common/CustomBoxes';
import { useTheme } from '@mui/styles';
import { CollapsableErrorWithPros, CollapsableSuccessWithPros } from '../common/CustomCollapsables';


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

export function UserFormZod() {
  const theme = useTheme() as Theme;
  const styles = getStyles(theme)
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
  } = useForm<TCreateUserDto>({ // Call useForm hook with generic type FormData
    // resolver: specify resolver for form validation using Zod
    resolver: zodResolver(createUserDtoSchema), // Pass Zod schema to resolver
    // defaultValues: specify default values for form inputs
    defaultValues: initFormState,
  });
  const { mutate, isPending, error, data } = queryClient.create.useMutation();


  useEffect(() => {

    error ? setOpenError(true) : setOpenError(false)

  }, [error])


  useEffect(() => {
    let timer1: any;
    data?.body ? setOpenSuccess(true) : setOpenSuccess(false)
    if (data?.body) { timer1 = setTimeout(() => setOpenSuccess(false), 2000); }
    return () => clearTimeout(timer1);
  }, [data])


  const handleSubmitForm = (data: TCreateUserDto) => {
    mutate({ body: prepareInput(data) })
  }

  const prepareInput = (input: { name: string, age: number | string }): ICreateUserDto => {
    return { name: input.name, age: Number(input.age) }
  }

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)}>

      <CollapsableErrorWithPros sx={{ position: 'absolute', mt: 2.5 }} in={openError} onActionClick={() => { setOpenError(false) }}>
        <Typography sx={{ ...styles.collapsErrMsg }}> {getErrorMessage(error, textView.unknownError)}</Typography>
      </CollapsableErrorWithPros>

      <CollapsableSuccessWithPros sx={{ position: 'absolute', mt: 2.5 }} in={openSuccess} onActionClick={() => { setOpenSuccess(false) }}>
        <Typography sx={{ ...styles.collapsSuccMsg }}> {textView.mutationSuccess}</Typography>
      </CollapsableSuccessWithPros>

      <TwoRowBoxWithProps height={theme.areas.dataComponent['Form']['height']}>
        {/* <GridTitleTypography>{isPending ? textView.processing : textView.enterNewUser}</GridTitleTypography> */}
        <Typography sx={{ ...styles.title }}>{isPending ? textView.processing : textView.enterNewUser}</Typography>
        <TextField
          defaultValue={initFormState.name}
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
          type={'text'}
          size="small"
          sx={{ ...styles.name }}
          placeholder={textView.namePlaceholder}
          variant='outlined'

        />


        <TextField
          defaultValue={initFormState.age}
          type={'number'}
          {...register("age", { valueAsNumber: true })}
          error={!!errors.age}
          helperText={errors.age?.message}
          size="small"
          sx={{ ...styles.age }}
          placeholder={textView.agePlaceholder}
          variant='outlined'
        />

        <Button sx={{ ...styles.button }} type='submit'>{textView.submitButton}</Button>
      </TwoRowBoxWithProps>

    </form>
  )

}

const getErrorMessage = (error: any, unknownError: string): string => {
  if (error?.message) return error.message;
  else if (error?.body) return error.body as string;
  else return unknownError
}