import { Theme, Typography, TypographyProps, styled } from "@mui/material"
import { useTheme } from "@mui/styles"

export const getGridTitleTypographStyles = (theme: Theme) => ({
    ...theme.typography.gridFormTitle
})

export const GridTitleTypography = (props: TypographyProps) => {
    const { children, ...rest } = props;
    const theme = useTheme() as Theme;
    return (
        <Typography sx={{ ...getGridTitleTypographStyles(theme) }} {...rest}>{children}</Typography>
    )
}