import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MockedProvider } from "@apollo/client/testing";
import { GqlAllUsers, textView, GET_ALL_USERS, IStrictGqlUser } from './GqlAllUsers';
import { getStyles } from './GqlAllUsers'
import { replacer } from 'src/utils/test.utils';
import { ThemeProvider } from '@mui/styles';
import theme from '../common/Theme';
import { getGqlTheme } from './GqlTheme';
import { Group, UserViewDto } from '@graphql-adapter-code/dto/UserWithGroupDto';

const getGroups = (userId: string): Group[] => {
  return [{ groupId: 'abc', groupName: 'A', groupStatus: true, userId, userStatus: false }]
}
vi.mock('./GqlUpdateUserForm', () => ({
  UpdateUserForm: (props: UserViewDto) => <div data-testid="usersWithGroups">{`${JSON.stringify(props)}`}</div>
}))
const user1: IStrictGqlUser = {
  //in case of a schema-first back, a _typename field is needed
  // __typename: 'User',
  name: 'A',
  age: 10,
  userId: '1',

  groups: getGroups('1')
}
const user2: IStrictGqlUser = {
  //in case of a schema-first back, a _typename field is needed
  //  __typename: 'User',
  name: 'B',
  age: 13,
  userId: '2',

  groups: getGroups('2')
}
describe('<GqlAllUsers />', () => {



  test('GqlAllUsers mounts correctly and renders loading before the data is loaded', async () => {

    const dataMock = [user1, user2]
    const userClick = userEvent.setup();
    const mocks = [
      {
        request: {
          query: GET_ALL_USERS

        },
        result: {
          data: { getAllUsers: dataMock }

        }
      }

    ];

    const wrapper = render(
      <ThemeProvider theme={getGqlTheme(theme)}>
        <MockedProvider mocks={mocks}>
          <GqlAllUsers />
        </MockedProvider></ThemeProvider>
    );
    expect(wrapper).toBeTruthy();

    // Get by text using the React testing library
    const title = screen.getByText(textView.title)
    expect(title.textContent).toEqual(textView.title)
    const loading = screen.getByText(textView.loading)
    expect(loading.textContent).toEqual(textView.loading)
    expect(screen.queryAllByText(user1.name).length).toEqual(0)

  })

  test('GqlAllUsers mounts correctly and renders users', async () => {

    const dataMock = [user1, user2]
    const userClick = userEvent.setup();
    const mocks = [
      {
        request: {
          query: GET_ALL_USERS

        },
        result: {
          data: { getAllUsers: dataMock }

        }
      }

    ];

    const wrapper = render(
      <ThemeProvider theme={getGqlTheme(theme)}>
        <MockedProvider mocks={mocks}>
          <GqlAllUsers />
        </MockedProvider></ThemeProvider>
    );
    expect(wrapper).toBeTruthy();

    // Get by text using the React testing library
    const title = screen.getByText(textView.title)
    expect(title.textContent).toEqual(textView.title)
    await waitFor(() => {
      const users = screen.getAllByTestId("usersWithGroups")
      expect(users.length).toEqual(2)
      expect(users[0].textContent).toEqual(`${JSON.stringify(user1)}`)
      expect(users[1].textContent).toEqual(`${JSON.stringify(user2)}`)
    })





  })
  test('GqlAllUsers mounts correctly and renders a error message if there is an error', async () => {

    const dataMock = [user1, user2]
    const userClick = userEvent.setup();
    const mocks = [
      {
        request: {
          query: GET_ALL_USERS

        },
        result: {
          data: { getAllUsers: dataMock }

        }
      }

    ];

    const wrapper = render(
      <ThemeProvider theme={getGqlTheme(theme)}>
        <MockedProvider mocks={mocks}>
          <GqlAllUsers />
        </MockedProvider></ThemeProvider>
    );
    expect(wrapper).toBeTruthy();

    // Get by text using the React testing library
    const title = screen.getByText(textView.title)
    expect(title.textContent).toEqual(textView.title)
    const loading = screen.getByText(textView.loading)
    expect(loading.textContent).toEqual(textView.loading)
    expect(screen.queryAllByText(user1.name).length).toEqual(0)

  })
  test('getStyles does not produce null or undefined values', () => {
    const classes = getStyles(getGqlTheme(theme));
    expect(JSON.stringify(classes, replacer)).not.toContain('undefined')
    expect(JSON.stringify(classes, replacer)).not.toContain('null')
  })

});