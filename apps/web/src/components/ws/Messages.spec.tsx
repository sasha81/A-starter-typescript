import { describe, test, expect } from 'vitest'
import { act, render, screen, waitFor } from '@testing-library/react'
import Messages, { IProps as InputProps, getStyles } from './Messages';
import { ThemeProvider } from '@mui/styles';
import { getWsTheme } from './WsTheme';
import theme from '../common/Theme';
import { replacer } from 'src/utils/test.utils';


describe('<Messages/>', () => {
    test('messages are rendered', async () => {
        const msgs = [{ message: 'msg_1', userId: "A" }, { message: 'msg_2', userId: 'A' }]


        const wrapper = render(<ThemeProvider theme={getWsTheme(theme)}><Messages messages={msgs} /></ThemeProvider>);
        expect(wrapper).toBeTruthy();
        expect(screen.queryAllByText(msgs[0].message).length).toEqual(1)
        expect(screen.queryAllByText(msgs[1].message).length).toEqual(1)

    })

    test('no nuls or undefined in the styles', () => {
        const classes = getStyles(getWsTheme(theme));
        expect(JSON.stringify(classes, replacer)).not.toContain('undefined')
        expect(JSON.stringify(classes, replacer)).not.toContain('null')
    })
})
