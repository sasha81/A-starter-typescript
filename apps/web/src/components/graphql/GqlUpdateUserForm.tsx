import { zodResolver } from "@hookform/resolvers/zod";
import { Card, Theme, SelectChangeEvent } from "@mui/material";
import { useEffect, useReducer, useState } from "react"; import { useForm } from "react-hook-form";
import { getUpdateUserDtoFromView } from '@graphql-adapter-code/converters/view-to-user-dto.converter'
import { useTheme } from '@mui/styles';
import { gql, useMutation } from "@apollo/client";
import { UserCardContent } from "../common/UserCardContent";
import { UserUpdateFormWithGroups } from "../common/UserUpdateFormWithGroups";
import { UserViewDto } from "@graphql-adapter-code/dto/UserWithGroupDto";
import { userWithIdDtoSchema } from "@graphql-adapter-code/zod-schema/user-zod.schema";
import { UpdateUserInput } from "@graphql-adapter-code/dto/CreateUserInput";



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

export const UPDATE_USER = gql(`
    mutation UpdateUser($input: UpdateUserInput!){
        updateUser(input: $input) {           
            userId
            name
            age
        }
    }
`);
export const UpdateUserForm = (props: UserViewDto): React.JSX.Element => {
  const theme = useTheme() as Theme;
  const styles = getStyles(theme)
  const [saveUser, { error, data, loading }] = useMutation(UPDATE_USER)
  const [group, setGroup] = useState('');
  const [updateActive, setUpdateActive] = useState(false);
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const [openError, setOpenError] = useState(false);
  const initFormValues = prepareFormInitValues(data?.updateUser, props)
  const {
    // register: function to register input elements
    register,
    // handleSubmit: function to handle form submission
    handleSubmit,
    // watch: function to watch values of form inputs
    watch,
    // formState: object containing information about form state
    formState: { errors, touchedFields }, // Destructure errors and touchedFields from formState
  } = useForm<UpdateUserInput>({ // Call useForm hook with generic type FormData
    // resolver: specify resolver for form validation using Zod
    resolver: zodResolver(userWithIdDtoSchema), // Pass Zod schema to resolver
    // defaultValues: specify default values for form inputs
    defaultValues: { ...initFormValues },
  });


  useEffect(() => {
    //let timer1: any;
    error ? setOpenError(true) : setOpenError(false)
    // if(error) { timer1= setTimeout(() => setOpenError(false),2000);}  
    // return () => clearTimeout(timer1);  
  }, [error])

  useEffect(() => {
    if (data) forceUpdate()
  }, [data])

  const handleUpdateSubmit = (data: UpdateUserInput) => {
    saveUser({ variables: { input: prepareInput(data) } }).catch(e => { })
    setUpdateActive(false)
  };
  const prepareInput = (input: { name: string, age: number | string }): UpdateUserInput => {
    return { name: input.name, age: Number(input.age), userId: props.userId }
  }

  const handleGroupChange = (event: SelectChangeEvent) => {
    setGroup(event.target.value as string);
  };

  return (
    <Card sx={{ ...styles.card }}>
      {updateActive ?
        <UserUpdateFormWithGroups group={group} register={register} errors={errors} onGroupChange={handleGroupChange}
          handleSubmit={handleSubmit(handleUpdateSubmit)} {...prepareFormProps(data?.updateUser, props)} /> :

        <UserCardContent {...prepareFormProps(data?.updateUser, props)} setUpdateActive={setUpdateActive} errorMsg={getErrorMessage(error, textView.unknownError)}
          openError={openError} isPending={loading} group={group} setOpenError={setOpenError} onGroupChange={handleGroupChange}
        />
      }
    </Card>
  )
}
const prepareFormInitValues = (data: UpdateUserInput | undefined, props: UserViewDto): UpdateUserInput => {
  const propsFromView = getUpdateUserDtoFromView(props)
  if (data) return { ...propsFromView, ...data }
  else return propsFromView
}

const prepareFormProps = (data: UpdateUserInput | undefined, props: UserViewDto): UserViewDto => {
  if (data) return { ...props, ...data }
  else return props
}



const getErrorMessage = (error: any, unknownError: string): string => {
  if (error?.message) return error.message;
  else if (error?.body) return error.body as string;
  else return unknownError
}