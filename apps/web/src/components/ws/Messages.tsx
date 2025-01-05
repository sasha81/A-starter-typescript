import { Box, Grid, Theme, Typography } from '@mui/material'
import React from 'react'
import { useTheme } from "@mui/styles";
import { IMessageDto } from '@ws-gateway/zod-schema/message-zod.schema';
import { UserId } from 'src/utils/UuId.util';
import { grey } from '@mui/material/colors';
export interface IProps {
    messages: IMessageDto[];
}

export const textView = {
    title: 'WS messages:',
    noMessages: 'No messages yet...',

}
const bdRadius = 18;
export const getStyles = (theme: Theme) => ({
    container: {
        ...theme.box.absolutePosContainer,
        top: theme.areas.dataComponent['SubHeader']['height'],
        height: `calc(100% - ${theme.areas.dataComponent['SubHeader']['height']})`,
        ...theme.box.flexGrid,
        ...theme.box.bgColorAndBorder,
        flexDirection: 'column',
        flexWrap: 'nowrap'
    },
    gridItem: (message: IMessageDto) => ({
        width: '80%', maxWidth: '80%',
        alignSelf: message.userId === UserId.getUserId() ? 'flex-end' : 'flex-start'
    }),
    gridItemText: (message: IMessageDto) => ({
        width: '80%', maxWidth: '80%',
        marginRight: message.userId === UserId.getUserId() ? 0 : '20%',
        marginLeft: message.userId === UserId.getUserId() ? '20%' : 0,
        bgcolor: message.userId === UserId.getUserId() ? 'white' : grey[700],
        color: message.userId === UserId.getUserId() ? 'black' : 'white',
        padding: 2,
        borderTopRightRadius: (message.userId === UserId.getUserId()) ? 0 : bdRadius,
        borderTopLeftRadius: (message.userId === UserId.getUserId()) ? bdRadius : 0,
        borderBottomLeftRadius: bdRadius, borderBottomRightRadius: bdRadius
    }),
    testContainer: {
        position: 'absolute', width: '98%', height: `calc(100% - ${theme.areas.dataComponent['SubHeader']['height']})`, left: '2.5%',
        top: theme.areas.dataComponent['SubHeader']['height']
        , overflowY: 'auto'
        , boxSizing: 'border-box'
    },
    title: {
        marginLeft: 1,
        height: theme.areas.dataComponent['SubHeader']['height'],
        boxSizing: 'border-box'
    },
    outerContainer: { position: 'relative', height: '100%', width: '100%', boxSizing: 'border-box' },
    button: { position: 'absolute', right: '10px', top: '0', height: '30px', ...theme.button.medium },
    loadMsg: { ...theme.typography.loadMessages }
    ,
    errMsg: { ...theme.typography.errorMessages }

})
export default function Messages({ messages }: IProps) {

    const theme = useTheme() as Theme;
    const styles = getStyles(theme)
    return (
        <Box sx={{ ...styles.outerContainer }}>
            <Typography variant='h5' sx={{ ...styles.title }}>{textView.title}</Typography>
            <Grid container sx={{ ...styles.container }} spacing={0.5}>

                {messages.length >= 1 ? messages.map((message, index) => (
                    <Grid item xs={12} sx={{ ...styles.gridItem(message) }} key={index}>
                        <Typography sx={{ ...styles.gridItemText(message) }}>{message.message}</Typography>
                    </Grid>
                )) : <Typography sx={{ ...styles.loadMsg, marginLeft: 1 }}>{textView.noMessages}</Typography>}
            </Grid>
        </Box>
    )
}