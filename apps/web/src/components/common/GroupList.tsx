import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Theme } from "@mui/material";
import { IGroup } from "@rest-adapter/ts-rest-contracts/user-contract";
import { useTheme } from '@mui/styles';
export interface IGroupListProps {
    groups: IGroup[];
    group: string;
    onChange: (event: SelectChangeEvent) => void;
    readOnly: boolean
}
export const getStyles = (theme: Theme) => ({
    select: { height: theme.areas.nameAgeCard['Groups']['sx'].height }
})
export const GroupList = (props: IGroupListProps): React.JSX.Element => {
    const theme = useTheme() as Theme;
    const styles = getStyles(theme)
    const { groups, group, onChange, readOnly } = props
    return (
        <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-label" >Groups</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                sx={{ width: '95%', height: styles.select.height }}
                value={group}
                label="Groups"
                onChange={onChange}
                inputProps={{ readOnly }}
                size="small"
            >
                {groups.map(gr => {
                    return (<MenuItem key={gr.groupId} value={gr.groupName}>{gr.groupName}</MenuItem>)

                })}

            </Select>
        </FormControl>
    )
}