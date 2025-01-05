import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextField, Theme, Typography } from "@mui/material"
import { IMessageDto, messageDtoSchema } from "@ws-gateway/zod-schema/message-zod.schema";
import { useTheme, } from '@mui/styles'
import { useForm } from "react-hook-form";
import { UserId } from "../../utils/UuId.util";
import { TwoRowBoxWithProps } from "../common/CustomBoxes";


export interface IProps {
  send: (val: IMessageDto) => void;
  disabled: boolean;
}

const getInitState = (): IMessageDto => {
  return { message: "", userId: UserId.getUserId() }
}
export const textView = {
  enterNewMessage: 'Type a new message',
  namePlaceholder: 'Hello! How are you?',
  sendName: 'Send'
}

export const useStyles = (theme: Theme) => {

  return {
    title: {
      ...theme.areas.nameAgeCreateForm['Title']['sx']  
    },
    button: {
      ...theme.button.medium
    },
    loadMsg: {
      ...theme.typography.loadMessages
    }
    ,
    errMsg: {
      ...theme.typography.errorMessages
    }

  }
};
export default function MessageInput({ send, disabled }: IProps) {

  const theme = useTheme() as Theme
  const styles = useStyles(theme)
  const {
    // register: function to register input elements
    register,
    // handleSubmit: function to handle form submission
    handleSubmit,
    // watch: function to watch values of form inputs
    watch,
    // formState: object containing information about form state
    formState: { errors, touchedFields }, // Destructure errors and touchedFields from formState
  } = useForm<IMessageDto>({ // Call useForm hook with generic type FormData
    // resolver: specify resolver for form validation using Zod
    resolver: zodResolver(messageDtoSchema), // Pass Zod schema to resolver
    // defaultValues: specify default values for form inputs
    defaultValues: getInitState(),
  });

  return (
    <form onSubmit={handleSubmit(send)} >      
      <TwoRowBoxWithProps height={theme.areas.dataComponent['Form']['height']}>
        {/* <GridTitleTypography>{textView.enterNewMessage}</ GridTitleTypography> */}
        <Typography sx={{...styles.title}}>{textView.enterNewMessage}</Typography>
        <TextField
          disabled={disabled}
          multiline
          size="small"
          defaultValue={getInitState().message}
          {...register("message")}
          error={!!errors.message}
          helperText={errors.message?.message}
          type={'text'}
          sx={{ margin: 0.5, gridRow: 2, gridColumnStart: 1, gridColumnEnd: 8 }}
          placeholder={textView.namePlaceholder}
          variant='outlined'
        />
        <Button sx={{ gridRow: 2, gridColumnStart: 8, gridColumnEnd: 8, marginRight: 0.75, ...styles.button }} disabled={disabled} type='submit'>{textView.sendName}</Button>
      </TwoRowBoxWithProps>
    </form>)
}