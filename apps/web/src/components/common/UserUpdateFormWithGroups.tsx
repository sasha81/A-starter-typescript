import { UseFormRegister } from "react-hook-form";
import { useTheme } from '@mui/styles';
import { Box, Button, CardContent, Grid, SelectChangeEvent, TextField, Theme } from "@mui/material";
import { GroupList } from "./GroupList";
import { IUserDtoWithGroups } from "@rest-adapter/ts-rest-contracts/user-contract";
import { TwoRowBoxWithProps } from "./CustomBoxes";
export interface IUserWithGroupProps extends IUserDtoWithGroups { }
export interface IUpdateUserProps extends IUserWithGroupProps {
    handleSubmit: (arg: any) => void,
    register: UseFormRegister<any>,
    errors: any,
    group: string;

    onGroupChange: (event: SelectChangeEvent) => void;
};

export const textView = {
    submit: 'OK',

}
export const getStyles = (theme: Theme) => ({
    container: { ...theme.areas.nameAgeCard['container']['sx'] },
    button: { ...theme.areas.nameAgeCard['Button']['sx'], mt: 0 },
    name: { ...theme.areas.nameAgeCard['Name']['sx'], mr: 0.5, ml: 0 },
    age: { ...theme.areas.nameAgeCard['Age']['sx'] },
    groups: { ...theme.areas.nameAgeCard['Groups']['sx'], mt: 0 },
    collapsErrMsg: { ...theme.typography.errorMessages, ...theme.box.collapsableText }
})

export const UserUpdateFormWithGroups = (props: IUpdateUserProps): React.JSX.Element => {
    const theme = useTheme() as Theme;
    const styles = getStyles(theme)
    const { register, handleSubmit, errors, group, onGroupChange, ...rest } = props;
    return (<form onSubmit={handleSubmit} >
        <TwoRowBoxWithProps sx={{ ...styles.container }} >
            <TextField
                defaultValue={props.name}
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
                type={'text'}
                size="small"
                variant='outlined'
                sx={{ ...styles.name }}
            />
            <TextField
                defaultValue={props.age}
                type={'number'}
                {...register("age", { valueAsNumber: true })}
                error={!!errors.age}
                helperText={errors.age?.message}
                size="small"
                variant='outlined'
                sx={{ ...styles.age }}
            />

            <Box sx={{ ...styles.groups }}>
                <GroupList groups={props?.groups} group={group} onChange={onGroupChange} readOnly={false} />
            </Box>
            <Button size="small" sx={{ ...styles.button }} type='submit'>
                {textView.submit}
            </Button>
        </TwoRowBoxWithProps>

    </form>)
}
