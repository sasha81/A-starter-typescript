import { Box, BoxProps, Theme } from "@mui/material";
import { styled, useTheme } from "@mui/styles";


export const getTwoRowBoxStyles = (theme: Theme) => ({
    height: theme.areas['Form']['height'], ...theme.box.formWith2fields
})

export const TwoRowBox = (props: BoxProps) => {
    const { children, ...rest } = props
    const theme = useTheme() as Theme;

    return (
        <Box sx={{ ...getTwoRowBoxStyles(theme) }} {...rest}>
            {children}
        </Box>
    )
}

//gridTemplateRows is in the form of '<number>fr *'. For exampple: '1fr 2fr'
export const TwoRowBoxWithProps = (props: BoxProps) => {
    const { children, sx, ...rest } = props
    const theme = useTheme() as Theme;

    return (
        <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            gridTemplateRows: '1fr 2fr',
            boxSizing: 'border-box',
            alignItems: 'center',
            '& > *': { boxSizing: 'border-box' },
            ...sx
        }} {...rest} >

            {children}

        </Box>
    )
}

export const OneRowBoxWithProps = (props: BoxProps) => {
    const { children, ...rest } = props
    const theme = useTheme() as Theme;

    return (
        <Box sx={{ ...theme.box.formWith1field }} {...rest}>
            {children}
        </Box>
    )
}