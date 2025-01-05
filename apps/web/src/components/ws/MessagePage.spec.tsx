
import io, { Socket } from 'socket.io-client'
import { describe, test, expect, vi, beforeEach, afterEach, afterAll } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import MessageInput, { IProps as InputProps } from './MessageInput';
import Messages, { IProps as MessagesProps } from "./Messages";
import { ThemeProvider } from '@mui/styles';
import theme from '../common/Theme';

vi.mock('./MessageInput', () => ({
  default: (props: InputProps) => <div>{`MessageInput${props.disabled}`}</div>
}))

vi.mock('./Messages', () => ({
  default: (props: MessagesProps) => <div>Messages mock</div>
}))


import { MessagePage, getMockMesages, getStyles } from './MessagePage'
import { getWsTheme } from './WsTheme';
import { UserId } from 'src/utils/UuId.util';
import { replacer } from 'src/utils/test.utils';


const VITE_WS_TOPIC = 'Topic_A', VITE_WS_URL = 'http://smth:3000';
vi.stubEnv('VITE_WS_TOPIC', VITE_WS_TOPIC)
vi.stubEnv('VITE_WS_URL', VITE_WS_URL)


vi.mock("socket.io-client", () => {
  const SocketMock = {
    url: '',
    emit: vi.fn(),
    on: vi.fn().mockImplementation((arg: string) => {

    }),
    off: vi.fn()
  };

  const IoMockObj = {
    io: vi.fn().mockImplementation((arg: string) => {
      SocketMock.url = arg

      return SocketMock
    }
    )
  }
  return { default: IoMockObj.io, Socket: SocketMock }
})






describe('<MessagePage />', () => {
  let io1: any; let Socket1: any;

  beforeEach(() => {
    io1 = io;
    Socket1 = Socket
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  afterAll(() => {
    vi.unstubAllEnvs()
  })

  test('Web Socket is connected to a right url and to a right topic', async () => {
    const onMock = vi.fn();


    Socket1.on = onMock


    const wrapper = render(<ThemeProvider theme={getWsTheme(theme)}><MessagePage /></ThemeProvider>);
    expect(wrapper).toBeTruthy();

    await waitFor(() => {

      expect(onMock.mock.calls[0][0]).toEqual(VITE_WS_TOPIC)
    })
    await waitFor(() => {

      expect(Socket1.url).toEqual(VITE_WS_URL)
    })

  })

  test('mocked messages ', () => {
    const size = 50
    const msgs = getMockMesages(size)
    expect(msgs.length).toEqual(size)
    const idSet = new Set()
    msgs.forEach(msg => {
      idSet.add(msg.userId)
    })
    expect(idSet.size).toBeLessThan(35)
    expect(idSet.has(UserId.getUserId())).toBeTruthy()
  })

  test('no nuls or undefined in the styles', () => {
    const classes = getStyles(getWsTheme(theme));
    expect(JSON.stringify(classes, replacer)).not.toContain('undefined')
    expect(JSON.stringify(classes, replacer)).not.toContain('null')
  })


})