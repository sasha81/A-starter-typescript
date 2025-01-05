import { describe, test, expect, vi } from 'vitest'
import { act, render, screen, waitFor } from '@testing-library/react'
import MessageInput,{ IProps as InputProps,textView } from './MessageInput' ;
import userEvent from '@testing-library/user-event';



describe('<MessageInput/>',()=>{
    test('a complient message is entered and a callback called',async()=>{
        const userClick = userEvent.setup();
        const message = 'message_1';
       
        const callback = vi.fn()

        const wrapper =  render(<MessageInput send={callback} disabled={false}/>);
        expect(wrapper).toBeTruthy();    


        await act(async ()=>{
            await userClick.clear(screen.getByPlaceholderText(textView.namePlaceholder))  
            await userClick.type(screen.getByPlaceholderText(textView.namePlaceholder),message)              
            await  userClick.click(screen.getByRole('button'))
          })
         
          expect(callback.mock.calls[0][0]).toEqual(message)  
    });
   
})





