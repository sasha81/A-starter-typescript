import { Button, CardContent, CircularProgress, Grid, SelectChangeEvent, Typography, Theme, Box } from "@mui/material";
import { useTheme } from '@mui/styles';
import { CollapsableErrorWithPros } from "./CustomCollapsables";
import { GroupList } from "./GroupList";
import { TUserDtoWithGroups } from "@rest-adapter/ts-rest-contracts/user-contract";
import { UserViewDto } from "@graphql-adapter-code/dto/UserWithGroupDto";
import EditIcon from '@mui/icons-material/Edit';
import { TwoRowBoxWithProps } from "./CustomBoxes";

export const textView = {
    update: 'Update',

}
export const getStyles = (theme: Theme) => ({
    container: { ...theme.areas.nameAgeCard['container']['sx'] },
    button: {
        ...theme.areas.nameAgeCard['Button']['sx']
    },
    name: {
        ...theme.areas.nameAgeCard['Name']['sx'], ml: 1, mt: 1,
    },
    age: {
        ...theme.areas.nameAgeCard['Age']['sx'], mt: 1,
    },
    groups: {
        ...theme.areas.nameAgeCard['Groups']['sx']
    },
    collapsErrMsg: {
        ...theme.typography.errorMessages, ...theme.box.collapsableText
    }
})
export interface IUserWithGroupProps extends Extract<TUserDtoWithGroups, UserViewDto> { }
export interface ICardUserProps extends IUserWithGroupProps {
    setUpdateActive: (arg: boolean) => void;
    setOpenError: (arg: boolean) => void;
    openError: boolean;
    errorMsg: string;
    isPending: boolean;

    group: string;
    onGroupChange: (event: SelectChangeEvent) => void;
};
export const UserCardContent = (props: ICardUserProps): React.JSX.Element => {
    const theme = useTheme() as Theme;
    const styles = getStyles(theme)
    const { setOpenError, errorMsg, setUpdateActive, isPending, openError, onGroupChange, group, name, age } = props;
    return (
        <Box sx={{ height: '100%' }}>
            <CollapsableErrorWithPros sx={{ position: 'absolute', mt: 2.5 }} in={openError} onActionClick={() => { setOpenError(false) }}>
                <Typography sx={{ ...styles.collapsErrMsg }}> {errorMsg}</Typography>
            </CollapsableErrorWithPros>
            <TwoRowBoxWithProps sx={{ ...styles.container }}>
                <Typography sx={{ ...styles.name }}>{name}</Typography>
                <Typography sx={{ ...styles.age }}>{`${age} y.o.`}</Typography>
                <Box sx={{ ...styles.groups }}>
                    <GroupList groups={props?.groups} group={group} onChange={onGroupChange} readOnly={false} />
                </Box>
                <Button size="small" sx={{ ...styles.button }} onClick={() => { setUpdateActive(true) }}>
                    {isPending ? <CircularProgress /> : <EditIcon />}
                </Button>
            </TwoRowBoxWithProps>
        </Box>
    )
}