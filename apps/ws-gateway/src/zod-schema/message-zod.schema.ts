import { z } from 'zod';
import { toZod } from "tozod";

export interface IMessageDto{
    message: string; 
    userId: string   
}

export interface IErrorMessageDto extends IMessageDto{
    error: string
}
export const errorMessages={
    message:'Message shuld be more then 2 char long',
    userId:'Uuid 6x6x6x6'
}

const msgDtoObject = { message: z.string().min(2,errorMessages.message),
                        userId: z.string().uuid(errorMessages.userId)
                        }



export const messageDtoSchema: toZod<IMessageDto> = z.object(msgDtoObject)





