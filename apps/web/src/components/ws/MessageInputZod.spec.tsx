import { describe, test, expect, vi } from 'vitest'
import { act, render, screen, waitFor } from '@testing-library/react'
import MessageInput, { IProps as InputProps, textView, useStyles } from './MessageInputZod';
import userEvent from '@testing-library/user-event';
import { errorMessages } from '@ws-gateway/zod-schema/message-zod.schema';
import { ThemeProvider } from '@mui/styles';
import theme from '../common/Theme';
import { replacer } from 'src/utils/test.utils';
import { getWsTheme } from './WsTheme';
import { UserId } from 'src/utils/UuId.util';

describe('<MessageInput/>', () => {
  test('a complient message is entered and a callback called', async () => {
    const userClick = userEvent.setup();
    const message = 'message_1';

    const callback = vi.fn()

    const wrapper = render(<ThemeProvider theme={getWsTheme(theme)}><MessageInput send={callback} disabled={false} /></ThemeProvider>);
    expect(wrapper).toBeTruthy();


    await act(async () => {
      await userClick.clear(screen.getByPlaceholderText(textView.namePlaceholder))
      await userClick.type(screen.getByPlaceholderText(textView.namePlaceholder), message)
      await userClick.click(screen.getByRole('button'))
    })

    expect(callback.mock.calls[0][0]).toContain({ message })
    expect(callback.mock.calls[0][0].userId.length).toEqual(UserId.getUserId().length)
  });
  test('a non-complient message is entered and a callback is not called', async () => {
    const userClick = userEvent.setup();
    const message = '!';
    const userId = crypto.randomUUID()
    const callback = vi.fn()

    const wrapper = render(<ThemeProvider theme={getWsTheme(theme)}><MessageInput send={callback} disabled={false} /></ThemeProvider>);
    expect(wrapper).toBeTruthy();


    await act(async () => {
      await userClick.clear(screen.getByPlaceholderText(textView.namePlaceholder))
      await userClick.type(screen.getByPlaceholderText(textView.namePlaceholder), message)
      await userClick.click(screen.getByRole('button'))
    })
    await waitFor(() => {
      expect(callback).not.toBeCalled()
      expect(screen.queryAllByText(errorMessages.message).length).toEqual(1)

    })

  })
  test('all styles are defined', async () => {
    const classes = useStyles(getWsTheme(theme));
    expect(JSON.stringify(classes, replacer)).not.toContain('undefined')
    expect(JSON.stringify(classes, replacer)).not.toContain('null')



  })
})





