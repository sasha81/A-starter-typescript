import { useEffect, useState } from "react"
import io, { Socket } from 'socket.io-client'
import MessageInput from "./MessageInputZod";
import Messages from "./Messages";
import { Box, Theme, Typography } from "@mui/material";
import { IErrorMessageDto, IMessageDto } from '@ws-gateway/zod-schema/message-zod.schema'
import { UserId } from '../../utils/UuId.util'
import { useTheme } from '@mui/styles';
import { CollapsableErrorWithPros } from "../common/CustomCollapsables";
import { v4 as uuid } from 'uuid'

export const textView = {
    title: 'WS Protocol',
    connectionError: 'Connection error. Cant send messages!',
    userNotFound: 'No user matches your criteria',
    networkError: 'Network error',
    unknownError: 'UnknownError',
    subTitle: 'WS messages:',

}

interface IWsError {
    isOpen: boolean;
    error: Error | undefined;
}
const defaultError: IWsError = {
    isOpen: false,
    error: undefined
}
export const getStyles = (theme: Theme) => ({
    title: {
        textAlign: 'center', height: theme.areas.dataComponent['Header']['height']
    },
    allUsers: {
        height: `calc(100% - ${theme.areas.dataComponent['Form']['height']} - ${theme.areas.dataComponent['Header']['height']})`,
        width: '100%'
    }
    ,
    errMsg: {
        ...theme.typography.errorMessages,
    },
    collapsErrMsg: {
        ...theme.typography.errorMessages, ...theme.box.collapsableText
    }


})


export const MessagePage = () => {
    const theme = useTheme() as Theme;
    const styles = getStyles(theme)

    const [socket, setSocket] = useState<Socket>();
    const [messages, setMessages] = useState<IMessageDto[]>(getMockMesages(50, true));
    const [error, setError] = useState<IWsError>(defaultError)

    const send = (message: IMessageDto) => {
        socket?.emit(import.meta.env.VITE_WS_TOPIC, { ...message, userId: UserId.getUserId() });
    }
    const messageListener = (message: IMessageDto | IErrorMessageDto) => {
        if (message.hasOwnProperty('error')) {
            setError({ isOpen: true, error: new Error((message as IErrorMessageDto).error) })
        }
        else {
            setMessages((prev: IMessageDto[]) => {
                return [...prev, message]
            })
        }

    }

    useEffect(() => {

        const newSocket = io(import.meta.env.VITE_WS_URL)

        setSocket(newSocket)
    }, [setSocket])

    useEffect(() => {

        socket?.on(import.meta.env.VITE_WS_TOPIC, messageListener)
        socket?.on("connect", () => {
            setError({ ...defaultError })
        });
        socket?.on('connect_error', (errorBody) => {
            const err = updateErrorBody(errorBody, 'Connection Error')
            setError(prev => updateState(prev, err))
        });
        socket?.on('reconnect', (attemptNumber) => {
            setError({ isOpen: true, error: new Error(`Connection error. Reconnecting: ${attemptNumber}`) })
        });

        socket?.on('reconnect_attempt', (attemptNumber) => {
            setError({ isOpen: true, error: new Error(`Connection error. Attempt to recconnect: ${attemptNumber}`) })
        });
        return () => {
            socket?.off(import.meta.env.VITE_WS_TOPIC, messageListener)
        }
    }, [socket])

    return (
        <Box height={'100%'} width={'100%'}>
            <Typography sx={{ ...styles.title }} variant="h4">{textView.title}</Typography>
            <CollapsableErrorWithPros sx={{ position: 'absolute' }} in={error.isOpen} onActionClick={() => { setError({ ...error, isOpen: false }) }}>
                {error.isOpen && <Typography sx={{ ...styles.collapsErrMsg }}>{getErrorMessage(error.error)}</Typography>}
            </CollapsableErrorWithPros>

            <MessageInput send={send} disabled={!!(error.isOpen || error.error)} />
            <Box sx={{ ...styles.allUsers }}>
                <Messages messages={messages} />
            </Box>
        </Box>
    )
}
const updateErrorBody = (error: Error, context: string): Error => {
    if (error?.message) return { ...error, message: context + ': ' + error.message };
    else if (error?.cause) return { ...error, message: context + ': ' + error.cause };
    else return { ...error, message: context };
}

const getErrorMessage = (error: Error | undefined): string => {
    if (error?.message) return error.message;
    else return error?.cause as string
}

const updateState = (prevState: IWsError, errorBody: Error): IWsError => {
    if (`${prevState.error}` === `${errorBody}`) return prevState;
    else return { isOpen: true, error: errorBody }
}
export const getMockMesages = (size: number, isReal?: boolean): IMessageDto[] => {
    if (isReal) return [];

    const items = [
        'A loooooooooooooooooooong loooooooooooong looooooooong looooooooong Msg number',
        'A mediuuuuuuuuuuuuuuum Msg number',
        'A short Msg number'
    ]
    const outputArr = [];
    for (let i = 0; i < size; i++) {
        outputArr.push({
            message: `${items[Math.floor(Math.random() * items.length)]} ${i}`, userId: getRandomUuid(UserId.getUserId())
        })
    }
    return outputArr
}

const getRandomUuid = (userId: string): string => {
    return Math.random() < 0.5 ? userId : uuid()
}