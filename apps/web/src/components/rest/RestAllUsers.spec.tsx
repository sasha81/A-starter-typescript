import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RestAllUsers, textView } from './RestAllUsers'
import { IGroup, IUserDto, IUserDtoWithGroups, userApi } from "@rest-adapter/ts-rest-contracts/user-contract";
import { initQueryClient, } from "@ts-rest/react-query";
import theme from '../common/Theme';
import { getStyles } from './RestAllUsers'
import { replacer } from 'src/utils/test.utils';
import { ThemeProvider } from '@mui/styles';
import { getRestTheme } from './RestTheme';
import { IUserWithGroupProps } from './RestUpdateUserForm';


vi.mock("@ts-rest/react-query", () => {
  const queryClient = {
    getAll: {
      useQuery: vi.fn()
    }
  }
  const initQueryClient = (_x: any, _y: any) => {
    return queryClient
  };


  return { initQueryClient };
})

vi.mock('./RestUpdateUserForm', () => ({
  UpdateUserForm: (props: IUserWithGroupProps) => <div id="usersWithGroups">{`${JSON.stringify(props)}`}</div>
}))

const getGroups = (userId: string): IGroup[] => {
  return [{ groupId: 'abc', groupName: 'A', groupStatus: true, userId, userStatus: false }]
}

const user1: IUserDtoWithGroups = {
  //in case of a schema-first back, a _typename field is needed
  // __typename: 'User',
  age: 10,
  userId: '1',
  name: 'A',
  groups: getGroups('1')
}
const user2: IUserDtoWithGroups = {
  //in case of a schema-first back, a _typename field is needed
  //  __typename: 'User',
  age: 13,
  userId: '2',
  name: 'B',
  groups: getGroups('2')
}
describe('<RestAllUsers />', () => {
  let queryClient: any;

  beforeEach(() => {

    queryClient = initQueryClient(userApi, {
      baseUrl: import.meta.env.VITE_USER_URL,
      baseHeaders: {},
    })

  });
  afterEach(() => {
    vi.clearAllMocks();
  });


  test('RestPage mounts properly if data is returned', async () => {
    queryClient.getAll.useQuery.mockImplementation((arg1: any, arg2: any) => {
      return {
        data: {
          body: [user1, user2]
        },
        error: null,
        isPending: false
      }
    })

    const wrapper = render(<ThemeProvider theme={getRestTheme(theme)}><RestAllUsers /></ThemeProvider>);
    expect(wrapper).toBeTruthy();
    const user1OnScreen = screen.getByText(`${JSON.stringify(user1)}`)
    const user2OnScreen = screen.getByText(`${JSON.stringify(user2)}`)

    expect(user1OnScreen).toBeDefined()
    expect(user2OnScreen).toBeDefined()

  })

  test('RestPage mounts properly if error is returned', async () => {
    const errorBody = 'Malformed querry'
    queryClient.getAll.useQuery.mockImplementation((arg1: any, arg2: any) => {
      return {
        data: null,
        error: {
          message: errorBody
        },
        isPending: false
      }
    })

    const wrapper = render(<ThemeProvider theme={getRestTheme(theme)}><RestAllUsers /></ThemeProvider>);
    expect(wrapper).toBeTruthy();

    const err = screen.getByText(errorBody)

    expect(err.textContent).toEqual(errorBody)



  })
  test('RestPage mounts properly if pended', async () => {

    queryClient.getAll.useQuery.mockImplementation((arg1: any, arg2: any) => {
      return {
        data: null,
        error: null,
        isPending: true
      }
    })

    const wrapper = render(<ThemeProvider theme={getRestTheme(theme)}><RestAllUsers /></ThemeProvider>);
    expect(wrapper).toBeTruthy();

    const pending = screen.getByText(textView.loading)

    expect(pending.textContent).toEqual(textView.loading)
    expect(screen.queryAllByText(textView.userNotFound).length).toEqual(0)
  })

  test('getStyles does not produce null or undefined values', () => {
    const classes = getStyles(getRestTheme(theme));
    expect(JSON.stringify(classes, replacer)).not.toContain('undefined')
    expect(JSON.stringify(classes, replacer)).not.toContain('null')
  })
});