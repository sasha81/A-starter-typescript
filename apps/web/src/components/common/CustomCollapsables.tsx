import { Alert, Collapse, CollapseProps, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';
import CheckIcon from '@mui/icons-material/Check';

export const CollapsableErrorWithPros = (props: CollapseProps & { onActionClick: () => void }): React.JSX.Element => {
    const { children, sx, onActionClick, ...rest } = props
    return (
        <Collapse sx={{ ...sx, zIndex: 9 }} {...rest}>
            <Alert icon={<PriorityHighOutlinedIcon fontSize="large" />} severity="error"
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="medium"
                        onClick={onActionClick}
                    >
                        <CloseIcon fontSize="medium" />
                    </IconButton>
                }
                sx={{ mb: 2, minHeight: '80%' }}
            >
                {children}
            </Alert>
        </Collapse>
    )
}

export const CollapsableSuccessWithPros = (props: CollapseProps & { onActionClick: () => void }): React.JSX.Element => {
    const { children, sx, onActionClick, ...rest } = props
    return (
        <Collapse sx={{ maxWidth: '29%', zIndex: 9, ...sx }} {...rest}>
            <Alert icon={<CheckIcon fontSize="large" />} severity="success"
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="medium"
                        onClick={onActionClick}
                    >
                        <CloseIcon fontSize="medium" />
                    </IconButton>
                }
                sx={{ mb: 2, minHeight: '80%' }}
            >
                {children}
            </Alert>
        </Collapse>
    )
}