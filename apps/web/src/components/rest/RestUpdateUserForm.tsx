import { zodResolver } from "@hookform/resolvers/zod";
import { Card, Theme, SelectChangeEvent } from "@mui/material";
import { IUpdateUserDto, IUserDtoWithGroups, userWithIdDtoSchema } from "@rest-adapter/ts-rest-contracts/user-contract";
import { getUpdateUserDtoFromView } from '@rest-adapter/converters/view-to-user-dto.converter'
import { useEffect, useReducer, useState } from "react";
import { useForm } from "react-hook-form";
import { queryClient } from "./RestAllUsers";
import { useTheme } from '@mui/styles';
import { UserUpdateFormWithGroups } from "../common/UserUpdateFormWithGroups";
import { UserCardContent } from "../common/UserCardContent";

export interface IUserWithGroupProps extends IUserDtoWithGroups { }

export const textView = {
  processing: 'Processing...',
  enterNewUser: 'Enter a new User',
  namePlaceholder: 'User name',
  agePlaceholder: 'Age',
  mutationSuccess: 'Operation succeeded!',
  unknownError: 'Unknown error!',
  submitButton: 'Submit'
}

export const getStyles = (theme: Theme) => ({

  card: { ...theme.areas.nameAgeCard['container'], maxWidth: '98%' },


})
export const UpdateUserForm = (props: IUserWithGroupProps): React.JSX.Element => {
  const theme = useTheme() as Theme;
  const styles = getStyles(theme)
  const { mutate, isPending, error, data } = queryClient.update.useMutation();
  const [group, setGroup] = useState('');
  const [updateActive, setUpdateActive] = useState(false);
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const [openError, setOpenError] = useState(false);
  const initFormValues = prepareFormInitValues(data?.body, props)
  const {
    // register: function to register input elements
    register,
    // handleSubmit: function to handle form submission
    handleSubmit,
    // watch: function to watch values of form inputs
    watch,
    // formState: object containing information about form state
    formState: { errors, touchedFields }, // Destructure errors and touchedFields from formState
  } = useForm<IUpdateUserDto>({ // Call useForm hook with generic type FormData
    // resolver: specify resolver for form validation using Zod
    resolver: zodResolver(userWithIdDtoSchema), // Pass Zod schema to resolver
    // defaultValues: specify default values for form inputs
    defaultValues: { ...initFormValues },
  });

  const handleGroupChange = (event: SelectChangeEvent) => {
    setGroup(event.target.value as string);
  };


  useEffect(() => {
    //let timer1: any;
    error ? setOpenError(true) : setOpenError(false)
    // if(error) { timer1= setTimeout(() => setOpenError(false),2000);}  
    // return () => clearTimeout(timer1);  
  }, [error])

  useEffect(() => {
    if (data) forceUpdate()
  }, [data])

  const handleUpdateSubmit = (data: IUpdateUserDto) => {
    mutate({ body: prepareInput(data) });
    setUpdateActive(false)
  };
  const prepareInput = (input: { name: string, age: number | string }): IUpdateUserDto => {
    return { name: input.name, age: Number(input.age), userId: props.userId }
  }
  return (
    <Card sx={{ ...styles.card }}>
      {updateActive ?
        <UserUpdateFormWithGroups group={group} register={register} errors={errors} onGroupChange={handleGroupChange}
          handleSubmit={handleSubmit(handleUpdateSubmit)} {...prepareFormProps(data?.body, props)} /> :

        <UserCardContent {...prepareFormProps(data?.body, props)} setUpdateActive={setUpdateActive}
          onGroupChange={handleGroupChange} errorMsg={getErrorMessage(error, textView.unknownError)}
          openError={openError} isPending={isPending} group={group} setOpenError={setOpenError}
        />
      }
    </Card>
  )
}
const prepareFormInitValues = (data: IUpdateUserDto | undefined, props: IUserWithGroupProps): IUpdateUserDto => {
  const propsFromView = getUpdateUserDtoFromView(props)
  if (data) return { ...propsFromView, ...data }
  else return propsFromView
}

const prepareFormProps = (data: IUpdateUserDto | undefined, props: IUserWithGroupProps): IUserWithGroupProps => {
  if (data) return { ...props, ...data }
  else return props
}


const getErrorMessage = (error: any, unknownError: string): string => {
  if (error?.message) return error.message;
  else if (error?.body) return error.body as string;
  else return unknownError
}


