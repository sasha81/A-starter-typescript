import { Box, Button, TextField } from "@mui/material"
import { useState } from "react"

export interface IProps {
    send: (val: string) => void;
    disabled: boolean
}

export const textView = {
    enterNewUser: 'Enter a new User',
    namePlaceholder: 'Type your message...',
    sendName: 'Send'
}


export default function MessageInput({ send, disabled }: IProps) {

    const [value, setValue] = useState('')

    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gridTemplateRows: '1fr', boxSizing: 'border-box', height: '70px', alignItems: 'center' }}>
            <TextField
                disabled={disabled}
                name='message'
                value={value}
                onChange={(e) => setValue(e.target.value)}
                type={'text'}
                sx={{ margin: 0.5, gridColumnStart: 1, gridColumnEnd: 8 }}
                placeholder={textView.namePlaceholder}
                variant='outlined'
            />
            <Button sx={{ gridColumnStart: 8, gridColumnEnd: 8 }} onClick={() => send(value)} disabled={disabled}>{textView.sendName}</Button>
        </Box>
    )
}